// src/data/questions.ts
// src/data/questions.ts
import type {BibleQuestion} from '../types/type.ts';

// Large database of Bible questions (100+ questions)
export const BIBLE_QUESTIONS: BibleQuestion[] = [
    // Easy Questions (40 questions)
    {
        id: 1,
        question: "How many books are in the Old Testament?",
        options: ["27", "39", "66", "50"],
        correctAnswer: 1,
        category: "Bible Basics",
        difficulty: "easy",
        scripture: "The Old Testament contains 39 books in Protestant Bibles",
        explanation: "The Old Testament has 39 books, divided into Law, History, Poetry, and Prophets.",
        points: 10
    },
    {
        id: 2,
        question: "What is the first book of the Bible?",
        options: ["Exodus", "Genesis", "Matthew", "Psalms"],
        correctAnswer: 1,
        category: "Bible Basics",
        difficulty: "easy",
        scripture: "Genesis 1:1 - 'In the beginning God created the heavens and the earth.'",
        explanation: "Genesis is the first book of the Bible, meaning 'beginning' in Greek.",
        points: 10
    },
    // Add 38 more easy questions...

    // Medium Questions (40 questions)
    {
        id: 41,
        question: "Who was the oldest man in the Bible?",
        options: ["Adam", "Noah", "Methuselah", "Abraham"],
        correctAnswer: 2,
        category: "Old Testament",
        difficulty: "medium",
        scripture: "Genesis 5:27 - 'Altogether, Methuselah lived a total of 969 years...'",
        explanation: "Methuselah lived 969 years, making him the oldest person recorded in the Bible.",
        points: 15
    },
    // Add 39 more medium questions...

    // Hard Questions (40 questions)
    {
        id: 81,
        question: "What are the four categories of Old Testament books in the Hebrew Bible?",
        options: ["Law, History, Poetry, Prophets", "Gospels, Epistles, History, Prophecy", "Pentateuch, Historical, Wisdom, Major/Minor Prophets", "Torah, Nevi'im, Ketuvim, Apocrypha"],
        correctAnswer: 2,
        category: "Bible Structure",
        difficulty: "hard",
        scripture: "The Hebrew Bible (Tanakh) is divided into Torah (Law), Nevi'im (Prophets), and Ketuvim (Writings).",
        explanation: "In Christian categorization: Pentateuch (5), Historical (12), Wisdom (5), Major/Minor Prophets (17).",
        points: 20
    },
    // Add 39 more hard questions...
];

// Additional specialized question sets
export const GOSPEL_QUESTIONS: BibleQuestion[] = [
    {
        id: 101,
        question: "Which Gospel begins with 'In the beginning was the Word'?",
        options: ["Matthew", "Mark", "Luke", "John"],
        correctAnswer: 3,
        category: "Gospels",
        difficulty: "medium",
        scripture: "John 1:1 - 'In the beginning was the Word, and the Word was with God, and the Word was God.'",
        explanation: "John's Gospel begins with a theological prologue about Jesus as the eternal Word.",
        points: 15
    },
    // Add more gospel questions...
];

export const MIRACLE_QUESTIONS: BibleQuestion[] = [
    {
        id: 201,
        question: "What was Jesus' first recorded miracle?",
        options: ["Walking on water", "Feeding the 5000", "Turning water to wine", "Healing the blind"],
        correctAnswer: 2,
        category: "Miracles",
        difficulty: "medium",
        scripture: "John 2:1-11 - On the third day a wedding took place at Cana in Galilee...",
        explanation: "Jesus turned water into wine at the wedding in Cana, showing his glory to his disciples.",
        points: 15
    },
    // Add more miracle questions...
];

// Function to get questions by category
export function getQuestionsByCategory(category: string): BibleQuestion[] {
    return BIBLE_QUESTIONS.filter(q => q.category === category);
}

// Function to get questions by difficulty
export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): BibleQuestion[] {
    return BIBLE_QUESTIONS.filter(q => q.difficulty === difficulty);
}

// Function to get unique random questions (no repetition until all used)
export function getUniqueRandomQuestions(count: number, excludeIds: number[] = []): BibleQuestion[] {
    const availableQuestions = BIBLE_QUESTIONS.filter(q => !excludeIds.includes(q.id));

    if (availableQuestions.length === 0) {
        return [];
    }

    // Shuffle and take requested count
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Get all available categories
export function getAllCategories(): string[] {
    const categories = new Set(BIBLE_QUESTIONS.map(q => q.category));
    return Array.from(categories);
}