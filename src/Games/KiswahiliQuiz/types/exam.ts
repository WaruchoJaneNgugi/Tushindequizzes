export interface Question {
  QuestionID: string;
  QuestionText: string;
  OptionA: string;
  OptionB: string;
  OptionC: string;
  OptionD: string;
  CorrectAnswer: string;
}

export interface Level {
  level: number;
  questions: Question[];
}

export interface Exam {
  ExamID: number;
  Title: string;
  Subject: string;
  Code: string;
  levels: Level[];
}

export interface Student {
  Name: string;
}