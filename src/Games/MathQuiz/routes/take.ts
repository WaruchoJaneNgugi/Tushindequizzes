import { Router } from "express";
// Use 'import type' for type-only imports to satisfy verbatimModuleSyntax
import type { Request, Response } from "express";
import type { Exam, Question, Level } from "../types/exam";

// Import the module string to ensure the compiler finds 'express-session' for augmentation
import "express-session";

declare module 'express-session' {
  interface SessionData {
    student: { Name: string };
    exam: Exam;
    currentLevel: number;
    answers: Record<string, boolean>;
  }
}

const router = Router();

// Mock Data
const exams: Exam[] = [
  {
    ExamID: 1,
    Title: "The Ultimate Challenge",
    Subject: "General Knowledge",
    Code: "GK-PRO",
    levels: [
      {
        level: 1,
        questions: [
          { QuestionID: "L1-Q1", QuestionText: "What is 2 + 2?", OptionA: "3", OptionB: "4", OptionC: "5", OptionD: "6", CorrectAnswer: "B" },
          { QuestionID: "L1-Q2", QuestionText: "Which color is the sky?", OptionA: "Blue", OptionB: "Green", OptionC: "Red", OptionD: "Pink", CorrectAnswer: "A" },
          { QuestionID: "L1-Q3", QuestionText: "Capital of France?", OptionA: "London", OptionB: "Berlin", OptionC: "Paris", OptionD: "Rome", CorrectAnswer: "C" }
        ]
      }
    ]
  }
];

/**
 * INITIAL ENTRY: Start the exam
 */
router.get("/take", (req: Request, res: Response) => {
  const exam = exams[0];
  req.session.student = { Name: "Ebet Student" };
  req.session.exam = exam;
  req.session.currentLevel = 1;
  req.session.answers = {};

  res.redirect(`/exams/take/${exam.ExamID}/1/0`);
});

/**
 * PROCESS ANSWER: Handle submissions and generate feedback
 */
router.post("/answer", (req: Request, res: Response) => {
  // FIX: Type assertion to resolve "string | string[]" error
  const { qIndex, answer, level } = req.body as { qIndex: string; answer: string; level: string };
  
  const exam = req.session.exam;
  const currentLevelNum = Number(level);
  const index = parseInt(qIndex, 10);

  if (!exam || !req.session.answers || !req.session.student) {
    return res.redirect("/exams/take");
  }

  const levelData = exam.levels.find((l: Level) => l.level === currentLevelNum);
  if (!levelData) return res.redirect("/exams/take");

  const currentQuestion = levelData.questions[index];
  const isCorrect = String(answer).trim().toUpperCase() === currentQuestion.CorrectAnswer;
  
  req.session.answers[currentQuestion.QuestionID] = isCorrect;

  let feedback = isCorrect ? "✅ Brilliant! Keep it up!" : "";
  if (!isCorrect) {
    const correctLetter = currentQuestion.CorrectAnswer;
    const correctText = (currentQuestion as any)[`Option${correctLetter}`];
    feedback = `❌ Not quite! The correct answer was ${correctLetter}: ${correctText}`;
  }

  let redirectUrl = "";
  const isLastInLevel = index + 1 >= levelData.questions.length;

  if (isLastInLevel) {
    let correctCount = 0;
    levelData.questions.forEach((q: Question) => {
      if (req.session.answers?.[q.QuestionID]) correctCount++;
    });

    const scorePercent = (correctCount / levelData.questions.length) * 100;

    if (scorePercent >= 70) {
      const nextLevelNum = currentLevelNum + 1;
      const nextLevelExists = exam.levels.find((l: Level) => l.level === nextLevelNum);
      
      if (nextLevelExists) {
        feedback += " | Level Passed! Moving up...";
        redirectUrl = `/exams/take/${exam.ExamID}/${nextLevelNum}/0`;
      } else {
        feedback = "🏆 Incredible! You've conquered all levels!";
        redirectUrl = `/exams/submit/${exam.ExamID}`;
      }
    } else {
      feedback += ` | Level Failed (${scorePercent.toFixed(0)}%). Try again!`;
      redirectUrl = `/exams/take`; 
    }
  } else {
    redirectUrl = `/exams/take/${exam.ExamID}/${currentLevelNum}/${index + 1}`;
  }

  res.render("TakeExam", {
    title: exam.Title,
    student: req.session.student,
    questions: [currentQuestion],
    currentIndex: index,
    currentLevel: currentLevelNum,
    success: feedback,
    isWrong: !isCorrect,
    redirectUrl: redirectUrl,
    selectedAnswer: answer 
  });
});

/**
 * QUESTION ROUTE: Display the actual question
 */
router.get("/take/:examId/:level/:qIndex", (req: Request, res: Response) => {
  const { level, qIndex } = req.params;
  const exam = req.session.exam;
  const student = req.session.student;

  if (!exam || !student) return res.redirect("/exams/take");

  const levelData = exam.levels.find((l: Level) => l.level === Number(level));
  //const index = parseInt(qIndex, 10);
  
  const index = parseInt(qIndex as string, 10);
  const currentQuestion = levelData?.questions[index];

  if (!currentQuestion) return res.redirect("/exams/take");

  res.render("TakeExam", {
    title: exam.Title,
    student: student,
    questions: [currentQuestion],
    currentIndex: index,
    currentLevel: Number(level),
    success: null,
    isWrong: false,
    redirectUrl: null,
    selectedAnswer: null 
  });
});

/**
 * SUBMIT: Final results page
 */
router.get("/submit/:examId", (req: Request, res: Response) => {
  res.render("TakeExam", {
    title: "Final Results",
    student: req.session.student || { Name: "Player" },
    questions: [],
    success: "Congratulations! You completed the challenge.",
    isWrong: false,
    redirectUrl: null,
    selectedAnswer: null,
    currentIndex: 0,
    currentLevel: 0
  });
});

export default router;