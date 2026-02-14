import React, { useState } from 'react';
import { QuizDifficulty, QuizStatus, QuestionType, convertGameResponseToQuiz } from '../types';
import type { Quiz, Category, Question, GameData } from '../types';
import { apiService } from '../services/api';

interface QuizzesProps {
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  categories: Category[];
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const Quizzes: React.FC<QuizzesProps> = ({ quizzes, setQuizzes, categories, questions, setQuestions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0]?.name || '',
    difficulty: QuizDifficulty.MEDIUM as QuizDifficulty,
    timeLimit: 15,
    passingScore: 100,
    questionText: '',
    choiceA: '',
    choiceB: '',
    markingAnswer: '',
    isRandomized: true,
    status: QuizStatus.PUBLISHED as QuizStatus
  });

  const toggleQuizStatus = async (id: string) => {
    try {
      const quiz = quizzes.find(q => q.id === id);
      if (!quiz) return;

      const newStatus = quiz.status === QuizStatus.PUBLISHED ? QuizStatus.DRAFT : QuizStatus.PUBLISHED;

      // Convert to GameData format for API
      const gameData: Partial<GameData> = {
        status: newStatus
      };

      const response = await apiService.updateGame(id, gameData);

      if (!response.success || response.error) {
        alert(`Failed to update status: ${response.error || 'Unknown error'}`);
        return;
      }

      setQuizzes(prev => prev.map(q =>
          q.id === id ? { ...q, status: newStatus } : q
      ));
    } catch (err) {
      alert(`Error updating quiz status: ${err|| 'Unknown error'}`);
    }
  };

  const openCreateModal = () => {
    setEditingQuiz(null);
    setFormData({
      title: '',
      description: '',
      category: categories.length > 0 ? categories[0].name : '',
      difficulty: QuizDifficulty.MEDIUM,
      timeLimit: 15,
      passingScore: 100,
      questionText: '',
      choiceA: '',
      choiceB: '',
      markingAnswer: '',
      isRandomized: true,
      status: QuizStatus.PUBLISHED
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleEdit = (quiz: Quiz) => {
    const question = questions.find(q => q.quizId === quiz.id);
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description || '',
      category: quiz.category,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      questionText: question?.text || '',
      choiceA: question?.options?.[0]?.text || '',
      choiceB: question?.options?.[1]?.text || '',
      markingAnswer: question?.correctAnswerText || '',
      isRandomized: quiz.isRandomized,
      status: quiz.status
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingQuiz) {
        // Update quiz via API - convert to GameData format
        const gameData: Partial<GameData> = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          difficulty: formData.difficulty, // This is the enum value, will be sent as string
          timeLimit: formData.timeLimit,
          passingScore: formData.passingScore,
          isRandomized: formData.isRandomized,
          status: formData.status // This is the enum value, will be sent as string
        };

        const response = await apiService.updateGame(editingQuiz.id, gameData);

        if (!response.success || response.error) {
          setError(response.error || 'Failed to update quiz');
          return;
        }

        // Update local state
        const updatedQuiz: Quiz = {
          ...editingQuiz,
          ...gameData,
          difficulty: formData.difficulty,
          status: formData.status,
          id: editingQuiz.id,
          createdAt: editingQuiz.createdAt
        };

        setQuizzes(prev => prev.map(q => q.id === editingQuiz.id ? updatedQuiz : q));

        // Update question if exists
        const existingQuestion = questions.find(q => q.quizId === editingQuiz.id);
        if (existingQuestion && formData.questionText) {
          const questionResponse = await apiService.updateQuestion(existingQuestion.id, {
            text: formData.questionText,
            options: [
              { id: 'opt-a', text: formData.choiceA },
              { id: 'opt-b', text: formData.choiceB }
            ],
            correctAnswer: formData.markingAnswer,
            points: 10,
            type: QuestionType.SINGLE,
            gameId: editingQuiz.id
          });

          if (questionResponse.success && questionResponse.data?.question) {
            setQuestions(prev => prev.map(q =>
                q.id === existingQuestion.id ? {
                  ...q,
                  text: formData.questionText,
                  options: [
                    { id: 'opt-a', text: formData.choiceA },
                    { id: 'opt-b', text: formData.choiceB }
                  ],
                  correctAnswerText: formData.markingAnswer,
                  quizId: editingQuiz.id
                } : q
            ));
          }
        } else if (formData.questionText) {
          // Create new question
          const questionResponse = await apiService.createQuestion({
            text: formData.questionText,
            options: [
              { id: 'opt-a', text: formData.choiceA },
              { id: 'opt-b', text: formData.choiceB }
            ],
            correctAnswer: formData.markingAnswer,
            points: 10,
            type: QuestionType.SINGLE,
            gameId: editingQuiz.id
          });

          if (questionResponse.success && questionResponse.data?.question) {
            // Create a safe question object with null checks
            const newQuestion: Question = {
              id: questionResponse.data.question.id,
              quizId: editingQuiz.id,
              text: formData.questionText,
              type: QuestionType.SINGLE,
              options: [
                { id: 'opt-a', text: formData.choiceA },
                { id: 'opt-b', text: formData.choiceB }
              ],
              correctAnswerText: formData.markingAnswer,
              points: 10,
              // gameId: editingQuiz.id,
              // correctAnswer: formData.markingAnswer,
              // createdAt: questionResponse.data.question.createdAt || new Date().toISOString(),
              // updatedAt: questionResponse.data.question.updatedAt
            };
            setQuestions(prev => [...prev, newQuestion]);
          }
        }
      } else {
        // Create new quiz via API
        const gameData: GameData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          difficulty: formData.difficulty, // Enum value, will be sent as string
          timeLimit: formData.timeLimit,
          passingScore: formData.passingScore,
          isRandomized: formData.isRandomized,
          status: formData.status // Enum value, will be sent as string
        };

        const response = await apiService.createGame(gameData);

        if (!response.success || response.error) {
          setError(response.error || 'Failed to create quiz');
          return;
        }

        if (!response.data?.game) {
          setError('No game data returned from server');
          return;
        }

        // Convert API response to Quiz type
        const newQuiz: Quiz = convertGameResponseToQuiz(response.data.game);

        setQuizzes(prev => [...prev, newQuiz]);

        // Create question if provided
        if (formData.questionText) {
          const questionResponse = await apiService.createQuestion({
            text: formData.questionText,
            options: [
              { id: 'opt-a', text: formData.choiceA },
              { id: 'opt-b', text: formData.choiceB }
            ],
            correctAnswer: formData.markingAnswer,
            points: 10,
            type: QuestionType.SINGLE,
            gameId: newQuiz.id
          });

          if (questionResponse.success && questionResponse.data?.question) {
            // Create a safe question object with null checks
            const newQuestion: Question = {
              id: questionResponse.data.question.id,
              quizId: newQuiz.id,
              text: formData.questionText,
              type: QuestionType.SINGLE,
              options: [
                { id: 'opt-a', text: formData.choiceA },
                { id: 'opt-b', text: formData.choiceB }
              ],
              correctAnswerText: formData.markingAnswer,
              points: 10,
              // gameId: newQuiz.id,
              // correctAnswer: formData.markingAnswer,
              // createdAt: questionResponse.data.question.createdAt || new Date().toISOString(),
              // updatedAt: questionResponse.data.question.updatedAt
            };
            setQuestions(prev => [...prev, newQuestion]);
          }
        }
      }

      setIsModalOpen(false);
    } catch (err) {
      setError(`Failed to save quiz: ${err|| 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this quiz? All associated questions will also be deleted.')) {
      try {
        setLoading(true);
        const response = await apiService.deleteGame(id);

        if (!response.success || response.error) {
          alert(`Failed to delete: ${response.error || 'Unknown error'}`);
          return;
        }

        // Update local state
        setQuizzes(prev => prev.filter(q => q.id !== id));
        setQuestions(prev => prev.filter(q => q.quizId !== id));
      } catch (err) {
        alert(`Error deleting quiz: ${err|| 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
      <div className="responsive-flex-header" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div className="responsive-flex-header">
          <div>
            <h1>Quiz Management</h1>
            <p className="subtitle">Manage and update your quiz repository.</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal} disabled={loading}>
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Quiz
          </button>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
            <tr>
              <th>Content / Status</th>
              <th>Category</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
            </thead>
            <tbody>
            {quizzes.length > 0 ? quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td>
                    <div className="table-content-main">
                      {quiz.title}
                    </div>
                    <div className="subtitle fs-xs">
                      {quiz.createdAt}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{quiz.category}</span>
                  </td>
                  <td>
                    <button
                        onClick={() => toggleQuizStatus(quiz.id)}
                        className={`badge badge-clickable ${quiz.status === QuizStatus.PUBLISHED ? 'badge-success' : 'badge-neutral'}`}
                        disabled={loading}
                    >
                      {quiz.status}
                    </button>
                  </td>
                  <td className="text-right">
                    <div className="table-actions-group">
                      <button
                          className="btn btn-ghost"
                          onClick={() => handleEdit(quiz)}
                          disabled={loading}
                      >
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                          className="btn btn-ghost text-danger"
                          onClick={() => handleDelete(quiz.id)}
                          disabled={loading}
                      >
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
            )) : (
                <tr>
                  <td colSpan={4} className="text-center" style={{ padding: '4rem' }}>
                    No quizzes yet. Create your first quiz!
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
            <div className="modal-overlay" onClick={() => !loading && setIsModalOpen(false)}>
              <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="m-0">{editingQuiz ? 'Update Quiz' : 'New Quiz'}</h2>
                  <button
                      className="btn btn-ghost"
                      onClick={() => setIsModalOpen(false)}
                      disabled={loading}
                  >
                    <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSave} autoComplete="off">
                  <div className="modal-body">
                    {error && (
                        <div className="error-message" style={{ marginBottom: '1rem' }}>
                          {error}
                        </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">Quiz Title *</label>
                      <input
                          type="text"
                          className="form-input"
                          placeholder="Enter quiz title"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                          className="form-input"
                          placeholder="Enter quiz description"
                          rows={2}
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          disabled={loading}
                      />
                    </div>

                    <div className="grid-2-col">
                      <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select
                            className="form-select"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            required
                            disabled={loading}
                        >
                          <option value="">Select a category</option>
                          {categories.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Difficulty *</label>
                        <select
                            className="form-select"
                            value={formData.difficulty}
                            onChange={(e) => setFormData({...formData, difficulty: e.target.value as QuizDifficulty})}
                            required
                            disabled={loading}
                        >
                          <option value={QuizDifficulty.EASY}>Easy</option>
                          <option value={QuizDifficulty.MEDIUM}>Medium</option>
                          <option value={QuizDifficulty.HARD}>Hard</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid-2-col">
                      <div className="form-group">
                        <label className="form-label">Time Limit (minutes) *</label>
                        <input
                            type="number"
                            className="form-input"
                            min="1"
                            max="60"
                            required
                            value={formData.timeLimit}
                            onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value) || 15})}
                            disabled={loading}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Passing Score (%) *</label>
                        <input
                            type="number"
                            className="form-input"
                            min="0"
                            max="100"
                            required
                            value={formData.passingScore}
                            onChange={(e) => setFormData({...formData, passingScore: parseInt(e.target.value) || 100})}
                            disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Sample Question (Optional)</label>
                      <textarea
                          className="form-input"
                          placeholder="Enter a sample question..."
                          rows={3}
                          value={formData.questionText}
                          onChange={(e) => setFormData({...formData, questionText: e.target.value})}
                          disabled={loading}
                      />
                    </div>

                    {formData.questionText && (
                        <>
                          <div className="grid-2-col">
                            <div className="form-group">
                              <label className="form-label">Choice A</label>
                              <input
                                  type="text"
                                  className="form-input"
                                  value={formData.choiceA}
                                  onChange={(e) => setFormData({...formData, choiceA: e.target.value})}
                                  disabled={loading}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Choice B</label>
                              <input
                                  type="text"
                                  className="form-input"
                                  value={formData.choiceB}
                                  onChange={(e) => setFormData({...formData, choiceB: e.target.value})}
                                  disabled={loading}
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Correct Answer</label>
                            <input
                                type="text"
                                className="form-input marking-input"
                                placeholder="Enter correct answer"
                                value={formData.markingAnswer}
                                onChange={(e) => setFormData({...formData, markingAnswer: e.target.value})}
                                disabled={loading}
                            />
                          </div>
                        </>
                    )}

                    <div className="grid-2-col">
                      <div className="form-group">
                        <label className="form-label">
                          <input
                              type="checkbox"
                              checked={formData.isRandomized}
                              onChange={(e) => setFormData({...formData, isRandomized: e.target.checked})}
                              disabled={loading}
                          />
                          <span style={{ marginLeft: '0.5rem' }}>Randomize Questions</span>
                        </label>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Status *</label>
                        <select
                            className="form-select"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value as QuizStatus})}
                            required
                            disabled={loading}
                        >
                          <option value={QuizStatus.PUBLISHED}>Published</option>
                          <option value={QuizStatus.DRAFT}>Draft</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setIsModalOpen(false)}
                        disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                      {loading ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg className="icon-sm animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {editingQuiz ? 'Updating...' : 'Creating...'}
                          </span>
                      ) : editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default Quizzes;