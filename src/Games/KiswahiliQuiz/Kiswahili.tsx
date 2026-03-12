import { useState } from 'react';
import TakeExam from './views/TakeExam';
import type { Exam } from './types/exam';


const mockExam: Exam = {
  ExamID: 1, Title: "Bingwa wa Kiswahili", Subject: "Kiswahili", Code: "KSW-4",
  levels: [
    { level: 1, questions: [
        { QuestionID: "1", QuestionText: "Wingi wa 'Jicho' ni?", OptionA: "Macho", OptionB: "Majicho", OptionC: "Vicho", OptionD: "Mijicho", CorrectAnswer: "A" },
        { QuestionID: "2", QuestionText: "Kinyume cha 'Nje' ni?", OptionA: "Mbali", OptionB: "Ndani", OptionC: "Chini", OptionD: "Kando", CorrectAnswer: "B" },
        { QuestionID: "3", QuestionText: "Mtu anayetibu wagonjwa ni?", OptionA: "Dereva", OptionB: "Daktari", OptionC: "Mwalimu", OptionD: "Nesi", CorrectAnswer: "B" }
      ]},
    { level: 2, questions: [
        { QuestionID: "4", QuestionText: "Nomino 'Maji' iko katika ngeli gani?", OptionA: "U-I", OptionB: "YA-YA", OptionC: "LI-YA", OptionD: "A-WA", CorrectAnswer: "C" },
        { QuestionID: "5", QuestionText: "Gari linaenda ____ barabara.", OptionA: "Kando ya", OptionB: "Katikati ya", OptionC: "Juu ya", OptionD: "Mbele ya", CorrectAnswer: "B" },
        { QuestionID: "6", QuestionText: "Wingi wa 'Mwalimu' ni?", OptionA: "Mawalimu", OptionB: "Walimu", OptionC: "Waalimu", OptionD: "Mwalimu", CorrectAnswer: "B" }
      ]},
    { level: 3, questions: [
        { QuestionID: "7", QuestionText: "Akili ni ____?", OptionA: "Mali", OptionB: "Nguvu", OptionC: "Bora", OptionD: "Pesa", CorrectAnswer: "A" },
        { QuestionID: "8", QuestionText: "Askari mlangoni ni?", OptionA: "Mbwa", OptionB: "Kufuli", OptionC: "Paka", OptionD: "Kufuli", CorrectAnswer: "B" },
        { QuestionID: "9", QuestionText: "Haba na haba hujaza ____?", OptionA: "Chungu", OptionB: "Kibaba", OptionC: "Kibaba", OptionD: "Gunia", CorrectAnswer: "B" }
      ]},
    { level: 4, questions: [
        { QuestionID: "10", QuestionText: "Mpole kama ____?", OptionA: "Sungura", OptionB: "Kondoo", OptionC: "Simba", OptionD: "Paka", CorrectAnswer: "B" },
        { QuestionID: "11", QuestionText: "Haraka haraka haina ____?", OptionA: "Baraka", OptionB: "Kazi", OptionC: "Mwisho", OptionD: "Mafanikio", CorrectAnswer: "A" },
        { QuestionID: "12", QuestionText: "Asiyesikia la mkuu huona la ____?", OptionA: "Mvua", OptionB: "Mkuu mwenzake", OptionC: "Mungu", OptionD: "Mvuvumivu", CorrectAnswer: "A" }
      ]}
  ]
};


export const KiswahiliQuiz=()=> {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [levelCorrectCount, setLevelCorrectCount] = useState(0);
  const [points, setPoints] = useState(10);
  const [isFinished, setIsFinished] = useState(false);

  const levelData = mockExam.levels.find(l => l.level === currentLevel);
  const currentQuestion = levelData?.questions[currentIndex];

  const handleAnswer = (answer: string) => {
    if (selectedAnswer || !currentQuestion) return;
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.CorrectAnswer;

    // Formula: -1 tackle, +1 if correct (Net 0)
    setPoints(prev => isCorrect ? prev : prev - 1);

    if (isCorrect) {
      setFeedback("✅ Safi! Jibu ni sahihi.");
      setIsWrong(false);
      setLevelCorrectCount(c => c + 1);
    } else {
      setFeedback("❌ Pole! Tazama jibu sahihi (Bluu).");
      setIsWrong(true);
    }

    setTimeout(() => {
      const isLast = currentIndex === 2;
      if (!isLast) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        const pass = (isCorrect ? levelCorrectCount + 1 : levelCorrectCount) >= 2;
        if (pass && currentLevel < 4) {
          setFeedback("🎉 NGAZI IMEPITA! Inapakia...");
          setTimeout(() => {
            setCurrentLevel(l => l + 1);
            setCurrentIndex(0);
            setLevelCorrectCount(0);
            setSelectedAnswer(null);
            setFeedback(null);
          }, 2000);
        } else if (pass && currentLevel === 4) {
          setIsFinished(true);
        } else {
          setFeedback("❌ UMEFELI! Jaribu tena ngazi hii.");
          setTimeout(() => {
            setCurrentIndex(0);
            setLevelCorrectCount(0);
            setSelectedAnswer(null);
            setFeedback(null);
          }, 3000);
        }
      }
    }, 2500); // Slightly longer timer so they can see the blue reveal
  };

  return (
      <TakeExam
          title={mockExam.Title}
          student={{ Name: "Mwanafunzi" }}
          questions={isFinished || !currentQuestion ? [] : [currentQuestion]}
          currentIndex={currentIndex}
          currentLevel={currentLevel}
          success={feedback}
          isWrong={isWrong}
          selectedAnswer={selectedAnswer}
          onAnswer={handleAnswer}
          points={points}
          redirectUrl={null}
      />
  );
}


