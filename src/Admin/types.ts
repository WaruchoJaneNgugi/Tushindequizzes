export const QuizDifficulty = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard'
} as const;
export type QuizDifficulty = typeof QuizDifficulty[keyof typeof QuizDifficulty];

export const QuizStatus = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft'
} as const;
export type QuizStatus = typeof QuizStatus[keyof typeof QuizStatus];

export const QuestionType = {
  SINGLE: 'Single Choice',
  MULTIPLE: 'Multiple Choice',
  SHORT_ANSWER: 'Short Answer'
} as const;
export type QuestionType = typeof QuestionType[keyof typeof QuestionType];

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: QuestionType;
  options?: Option[];
  correctAnswerIds?: string[];
  correctAnswerText?: string; // For Short Answer marking
  points: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: QuizDifficulty;
  timeLimit: number; // in minutes
  passingScore: number;
  isRandomized: boolean;
  status: QuizStatus;
  createdAt: string;
}

// export interface Player {
//   id: string;
//   username: string;
//   email: string;
//   registrationDate: string;
//   status: 'active' | 'disabled';
//   isDeleted: boolean;
// }
export interface Player {
  id: string;
  username: string;
  phoneNumber: string; // From backend
  status: 'active' | 'disabled'; // Only these two statuses
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt?: string;
  registrationDate: string; // Alias for createdAt
  isDeleted: boolean;
  // Remove email since your backend doesn't have it
}

export interface QuizAttempt {
  id: string;
  playerId: string;
  playerUsername: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalPoints: number;
  timeSpent: string; // MM:SS
  date: string;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  activeQuizzes: number;
  attemptsToday: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API Specific Types
export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string; // API returns string
  timeLimit: number;
  passingScore: number;
  isRandomized: boolean;
  status: string; // API returns string
  createdAt: string;
  updatedAt?: string;
}

export interface UserResponse {
  id: string;
  username: string;
  phoneNumber: string; // Required from backend
  status: 'active' | 'disabled' | 'suspended'; // Backend might have suspended
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface QuestionResponse {
  id: string;
  text: string;
  type: string;
  options: Option[];
  correctAnswer?: string;
  correctAnswerIds?: string[];
  points: number;
  gameId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionResponse {
  id: string;
  userId: string;
  username: string;
  gameId: string;
  gameTitle: string;
  score: number;
  totalPoints: number;
  duration: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

// API Request Types
export interface GameData {
  title: string;
  description: string;
  category: string;
  difficulty: string; // Send as string to API
  timeLimit: number;
  passingScore: number;
  isRandomized: boolean;
  status: string; // Send as string to API
  featured?: boolean;
  points?: number;
  imageUrl?: string;
  instructions?: string;
}

// Type guards for API responses
export function isGameResponse(obj: any): obj is GameResponse {
  return obj && typeof obj.title === 'string' && typeof obj.id === 'string';
}

export function isCategoryResponse(obj: any): obj is CategoryResponse {
  return obj && typeof obj.name === 'string' && typeof obj.id === 'string';
}

export function isUserResponse(obj: any): obj is UserResponse {
  return obj && typeof obj.username === 'string' && typeof obj.id === 'string';
}

// Conversion helpers
export function convertGameResponseToQuiz(game: GameResponse): Quiz {
  return {
    id: game.id,
    title: game.title,
    description: game.description || '',
    category: game.category,
    difficulty: game.difficulty as QuizDifficulty || QuizDifficulty.MEDIUM,
    timeLimit: game.timeLimit || 15,
    passingScore: game.passingScore || 100,
    isRandomized: game.isRandomized || true,
    status: game.status as QuizStatus || QuizStatus.DRAFT,
    createdAt: game.createdAt || new Date().toISOString().split('T')[0]
  };
}

export function convertUserResponseToPlayer(user: UserResponse): Player {
  return {
    id: user.id,
    username: user.username,
    phoneNumber: user.phoneNumber,
    // Convert 'suspended' status to 'disabled' for frontend
    status: user.status === 'suspended' ? 'disabled' : user.status,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    registrationDate: user.createdAt.split('T')[0], // Format date
    isDeleted: user.isDeleted || false
  };
}

export function convertQuizToGameData(quiz: Quiz): GameData {
  return {
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    difficulty: quiz.difficulty, // This is a QuizDifficulty enum value
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    isRandomized: quiz.isRandomized,
    status: quiz.status, // This is a QuizStatus enum value
  };
}