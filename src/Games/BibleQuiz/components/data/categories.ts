// Mahjong/data/categories.ts
// Mahjong/data/categories.ts
import type {QuizCategory} from '../types/quiz.ts';

export const categories: { id: QuizCategory; name: string; description: string }[] = [
    {
        id: 'people',
        name: 'Bible People',
        description: 'Characters from biblical history'
    },
    {
        id: 'places',
        name: 'Bible Places',
        description: 'Locations mentioned in Scripture'
    },
    {
        id: 'events',
        name: 'Bible Events',
        description: 'Significant biblical events'
    },
    {
        id: 'concepts',
        name: 'Bible Concepts',
        description: 'Theological ideas and teachings'
    },
    {
        id: 'verses',
        name: 'Bible Verses',
        description: 'Books, chapters and verses'
    },
    {
        id: 'general',
        name: 'General Bible',
        description: 'Mixed Bible knowledge'
    }
];