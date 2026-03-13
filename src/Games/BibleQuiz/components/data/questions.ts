// Mahjong/data/questions.ts - COMPLETELY BALANCED
// All quizzes have 10 questions, total 100 points each
import type {Question} from '../types/quiz';

export const questions: Question[] = [
    // ============================================
    // BIBLE PEOPLE - 10 questions @ 10 points = 100
    // ============================================
    {
        id: 'q1',
        quizId: 'bible-people',
        text: 'Who was the oldest person in the Bible?',
        options: ['Adam', 'Noah', 'Methuselah', 'Abraham'],
        correctAnswer: 2,
        explanation: 'Methuselah lived 969 years according to Genesis 5:27.',
        bibleReference: 'Genesis 5:27',
        points: 10
    },
    {
        id: 'q2',
        quizId: 'bible-people',
        text: 'Which disciple betrayed Jesus?',
        options: ['Peter', 'John', 'Judas Iscariot', 'Matthew'],
        correctAnswer: 2,
        explanation: 'Judas Iscariot betrayed Jesus for thirty pieces of silver.',
        bibleReference: 'Matthew 26:14-16',
        points: 10
    },
    {
        id: 'q3',
        quizId: 'bible-people',
        text: 'Who was thrown into a lions\' den but survived?',
        options: ['Daniel', 'David', 'Samson', 'Joseph'],
        correctAnswer: 0,
        explanation: 'Daniel was thrown into the lions\' den for praying to God.',
        bibleReference: 'Daniel 6:16-23',
        points: 10
    },
    {
        id: 'q4',
        quizId: 'bible-people',
        text: 'Who led the Israelites out of Egypt?',
        options: ['Abraham', 'Moses', 'Joshua', 'David'],
        correctAnswer: 1,
        explanation: 'Moses led the Israelites out of slavery in Egypt.',
        bibleReference: 'Exodus 3:10',
        points: 10
    },
    {
        id: 'q5',
        quizId: 'bible-people',
        text: 'Who was known as the "man after God\'s own heart"?',
        options: ['Solomon', 'David', 'Samuel', 'Joseph'],
        correctAnswer: 1,
        explanation: 'David was described as a man after God\'s own heart.',
        bibleReference: 'Acts 13:22',
        points: 10
    },
    {
        id: 'q6',
        quizId: 'bible-people',
        text: 'Who interpreted Pharaoh\'s dreams?',
        options: ['Daniel', 'Joseph', 'Moses', 'Jacob'],
        correctAnswer: 1,
        explanation: 'Joseph interpreted Pharaoh\'s dreams about the seven years of plenty and famine.',
        bibleReference: 'Genesis 41',
        points: 10
    },
    {
        id: 'q7',
        quizId: 'bible-people',
        text: 'Who was the mother of Jesus?',
        options: ['Mary', 'Martha', 'Elizabeth', 'Anna'],
        correctAnswer: 0,
        explanation: 'Mary was the mother of Jesus.',
        bibleReference: 'Luke 1:30-31',
        points: 10
    },
    {
        id: 'q8',
        quizId: 'bible-people',
        text: 'Who was sold into slavery by his brothers?',
        options: ['Joseph', 'Benjamin', 'Judah', 'Levi'],
        correctAnswer: 0,
        explanation: 'Joseph was sold into slavery by his jealous brothers.',
        bibleReference: 'Genesis 37:28',
        points: 10
    },
    {
        id: 'q9',
        quizId: 'bible-people',
        text: 'Who was the first king of Israel?',
        options: ['David', 'Solomon', 'Saul', 'Samuel'],
        correctAnswer: 2,
        explanation: 'Saul was the first king of Israel.',
        bibleReference: '1 Samuel 10:1',
        points: 10
    },
    {
        id: 'q10',
        quizId: 'bible-people',
        text: 'Who built the ark?',
        options: ['Abraham', 'Moses', 'Noah', 'Enoch'],
        correctAnswer: 2,
        explanation: 'Noah built the ark to save his family and the animals from the flood.',
        bibleReference: 'Genesis 6:14',
        points: 10
    },

    // ============================================
    // BIBLE PLACES - 10 questions @ 10 points = 100
    // ============================================
    {
        id: 'q11',
        quizId: 'bible-places',
        text: 'Where was Jesus born?',
        options: ['Nazareth', 'Jerusalem', 'Bethlehem', 'Galilee'],
        correctAnswer: 2,
        explanation: 'Jesus was born in Bethlehem as prophesied in Micah 5:2.',
        bibleReference: 'Matthew 2:1',
        points: 10
    },
    {
        id: 'q12',
        quizId: 'bible-places',
        text: 'Where did Moses receive the Ten Commandments?',
        options: ['Mount Sinai', 'Mount Zion', 'Mount Carmel', 'Mount of Olives'],
        correctAnswer: 0,
        explanation: 'God gave Moses the Ten Commandments on Mount Sinai.',
        bibleReference: 'Exodus 19:20',
        points: 10
    },
    {
        id: 'q13',
        quizId: 'bible-places',
        text: 'Which city was destroyed by fire and brimstone?',
        options: ['Jericho', 'Sodom', 'Nineveh', 'Babylon'],
        correctAnswer: 1,
        explanation: 'Sodom and Gomorrah were destroyed for their wickedness.',
        bibleReference: 'Genesis 19:24',
        points: 10
    },
    {
        id: 'q14',
        quizId: 'bible-places',
        text: 'Where did Jesus walk on water?',
        options: ['Sea of Galilee', 'Dead Sea', 'Mediterranean Sea', 'Red Sea'],
        correctAnswer: 0,
        explanation: 'Jesus walked on the Sea of Galilee.',
        bibleReference: 'Matthew 14:25',
        points: 10
    },
    {
        id: 'q15',
        quizId: 'bible-places',
        text: 'What was the capital of Israel during David\'s reign?',
        options: ['Jericho', 'Jerusalem', 'Hebron', 'Samaria'],
        correctAnswer: 1,
        explanation: 'David made Jerusalem the capital of Israel.',
        bibleReference: '2 Samuel 5:6-7',
        points: 10
    },
    {
        id: 'q16',
        quizId: 'bible-places',
        text: 'Where did Daniel live during his captivity?',
        options: ['Egypt', 'Babylon', 'Assyria', 'Persia'],
        correctAnswer: 1,
        explanation: 'Daniel lived in Babylon during the exile.',
        bibleReference: 'Daniel 1:1-6',
        points: 10
    },
    {
        id: 'q17',
        quizId: 'bible-places',
        text: 'Which river did Naaman wash in to be healed?',
        options: ['Nile', 'Jordan', 'Euphrates', 'Tigris'],
        correctAnswer: 1,
        explanation: 'Naaman was healed after washing in the Jordan River.',
        bibleReference: '2 Kings 5:10-14',
        points: 10
    },
    {
        id: 'q18',
        quizId: 'bible-places',
        text: 'Where did Paul experience his conversion?',
        options: ['Jerusalem', 'Damascus', 'Antioch', 'Rome'],
        correctAnswer: 1,
        explanation: 'Paul was converted on the road to Damascus.',
        bibleReference: 'Acts 9:1-6',
        points: 10
    },
    {
        id: 'q19',
        quizId: 'bible-places',
        text: 'What garden did Jesus pray in before his arrest?',
        options: ['Eden', 'Gethsemane', 'Golgotha', 'Bethany'],
        correctAnswer: 1,
        explanation: 'Jesus prayed in the Garden of Gethsemane.',
        bibleReference: 'Matthew 26:36',
        points: 10
    },
    {
        id: 'q20',
        quizId: 'bible-places',
        text: 'Where were the walls that fell after marching around them?',
        options: ['Jericho', 'Ai', 'Bethel', 'Gibeah'],
        correctAnswer: 0,
        explanation: 'The walls of Jericho fell after the Israelites marched around them.',
        bibleReference: 'Joshua 6:20',
        points: 10
    },

    // ============================================
    // BIBLE EVENTS - 10 questions @ 10 points = 100
    // (Changed from 15 to 10 points for consistency)
    // ============================================
    {
        id: 'q21',
        quizId: 'bible-events',
        text: 'What was the first miracle Jesus performed?',
        options: ['Walking on water', 'Turning water into wine', 'Feeding the 5000', 'Healing the blind man'],
        correctAnswer: 1,
        explanation: 'Jesus turned water into wine at the wedding in Cana.',
        bibleReference: 'John 2:1-11',
        points: 10
    },
    {
        id: 'q22',
        quizId: 'bible-events',
        text: 'How many days and nights did it rain during the flood?',
        options: ['7 days', '40 days', '100 days', '150 days'],
        correctAnswer: 1,
        explanation: 'It rained for 40 days and 40 nights during Noah\'s flood.',
        bibleReference: 'Genesis 7:12',
        points: 10
    },
    {
        id: 'q23',
        quizId: 'bible-events',
        text: 'What event happened at Pentecost?',
        options: ['The Holy Spirit descended', 'Jesus ascended to heaven', 'The church was persecuted', 'Peter healed a beggar'],
        correctAnswer: 0,
        explanation: 'The Holy Spirit descended on the apostles at Pentecost.',
        bibleReference: 'Acts 2:1-4',
        points: 10
    },
    {
        id: 'q24',
        quizId: 'bible-events',
        text: 'When did the walls of Jericho fall?',
        options: ['After Joshua prayed', 'After the people shouted', 'After the priests blew trumpets', 'All of the above'],
        correctAnswer: 3,
        explanation: 'The walls fell after the people shouted and the priests blew trumpets.',
        bibleReference: 'Joshua 6:20',
        points: 10
    },
    {
        id: 'q25',
        quizId: 'bible-events',
        text: 'What happened on the Day of Atonement?',
        options: ['The high priest entered the Holy of Holies', 'The Passover lamb was sacrificed', 'The temple was dedicated', 'The Law was read'],
        correctAnswer: 0,
        explanation: 'On Yom Kippur, the high priest entered the Holy of Holies.',
        bibleReference: 'Leviticus 16',
        points: 10
    },
    {
        id: 'q26',
        quizId: 'bible-events',
        text: 'How many plagues did God send on Egypt?',
        options: ['7', '10', '12', '40'],
        correctAnswer: 1,
        explanation: 'God sent 10 plagues upon Egypt before Pharaoh released the Israelites.',
        bibleReference: 'Exodus 7-12',
        points: 10
    },
    {
        id: 'q27',
        quizId: 'bible-events',
        text: 'What happened to Jonah when he was thrown overboard?',
        options: ['He drowned', 'He was swallowed by a great fish', 'He walked on water', 'He was rescued by a passing ship'],
        correctAnswer: 1,
        explanation: 'Jonah was swallowed by a great fish and spent three days in its belly.',
        bibleReference: 'Jonah 1:17',
        points: 10
    },
    {
        id: 'q28',
        quizId: 'bible-events',
        text: 'How many years did the Israelites wander in the wilderness?',
        options: ['20 years', '40 years', '70 years', '100 years'],
        correctAnswer: 1,
        explanation: 'The Israelites wandered for 40 years in the wilderness.',
        bibleReference: 'Numbers 32:13',
        points: 10
    },
    {
        id: 'q29',
        quizId: 'bible-events',
        text: 'What sign did God give Hezekiah that he would recover from illness?',
        options: ['The sun went backward', 'Rain fell from a clear sky', 'An earthquake occurred', 'A voice from heaven'],
        correctAnswer: 0,
        explanation: 'God made the shadow on the sundial go backward ten steps as a sign.',
        bibleReference: '2 Kings 20:8-11',
        points: 10
    },
    {
        id: 'q30',
        quizId: 'bible-events',
        text: 'What happened when Paul and Silas prayed in prison?',
        options: ['An earthquake opened the doors', 'Angels released them', 'The jailer set them free', 'Fire consumed the prison'],
        correctAnswer: 0,
        explanation: 'There was a great earthquake that opened the prison doors and loosened everyone\'s chains.',
        bibleReference: 'Acts 16:25-26',
        points: 10
    },

    // ============================================
    // BIBLE CONCEPTS - 10 questions @ 10 points = 100
    // (Changed from 15 to 10 points, added 8 more questions)
    // ============================================
    {
        id: 'q31',
        quizId: 'bible-concepts',
        text: 'What does "Immanuel" mean?',
        options: ['God is love', 'God with us', 'God is merciful', 'God is just'],
        correctAnswer: 1,
        explanation: 'Immanuel means "God with us" as prophesied in Isaiah.',
        bibleReference: 'Isaiah 7:14',
        points: 10
    },
    {
        id: 'q32',
        quizId: 'bible-concepts',
        text: 'What is the Greek word for "love" used in 1 Corinthians 13?',
        options: ['Eros', 'Phileo', 'Agape', 'Storge'],
        correctAnswer: 2,
        explanation: 'Agape is the selfless, unconditional love described in 1 Corinthians 13.',
        bibleReference: '1 Corinthians 13',
        points: 10
    },
    {
        id: 'q33',
        quizId: 'bible-concepts',
        text: 'What is "sanctification"?',
        options: ['Being saved from sin', 'Being made holy', 'Being forgiven', 'Being baptized'],
        correctAnswer: 1,
        explanation: 'Sanctification is the process of being made holy, set apart for God.',
        bibleReference: '1 Thessalonians 4:3',
        points: 10
    },
    {
        id: 'q34',
        quizId: 'bible-concepts',
        text: 'What is "justification"?',
        options: ['Being declared righteous', 'Being made perfect', 'Being healed', 'Being educated'],
        correctAnswer: 0,
        explanation: 'Justification is being declared righteous before God through faith.',
        bibleReference: 'Romans 5:1',
        points: 10
    },
    {
        id: 'q35',
        quizId: 'bible-concepts',
        text: 'What is the "Trinity"?',
        options: ['Father, Son, and Holy Spirit', 'Three gods in one', 'Jesus, Mary, and Joseph', 'Peter, James, and John'],
        correctAnswer: 0,
        explanation: 'The Trinity is one God in three persons: Father, Son, and Holy Spirit.',
        bibleReference: 'Matthew 28:19',
        points: 10
    },
    {
        id: 'q36',
        quizId: 'bible-concepts',
        text: 'What is "grace"?',
        options: ['Unmerited favor', 'Earned reward', 'Religious duty', 'Financial blessing'],
        correctAnswer: 0,
        explanation: 'Grace is God\'s unmerited favor - we cannot earn it.',
        bibleReference: 'Ephesians 2:8-9',
        points: 10
    },
    {
        id: 'q37',
        quizId: 'bible-concepts',
        text: 'What is "faith"?',
        options: ['Belief without evidence', 'Confidence in what we hope for', 'Religious rituals', 'Intellectual agreement'],
        correctAnswer: 1,
        explanation: 'Faith is confidence in what we hope for and assurance about what we do not see.',
        bibleReference: 'Hebrews 11:1',
        points: 10
    },
    {
        id: 'q38',
        quizId: 'bible-concepts',
        text: 'What is "redemption"?',
        options: ['Being bought back', 'Being punished', 'Being forgotten', 'Being exalted'],
        correctAnswer: 0,
        explanation: 'Redemption means being bought back from slavery to sin by Christ\'s blood.',
        bibleReference: 'Ephesians 1:7',
        points: 10
    },
    {
        id: 'q39',
        quizId: 'bible-concepts',
        text: 'What is "propitiation"?',
        options: ['The wrath-bearing sacrifice', 'A prayer request', 'A church office', 'A type of offering'],
        correctAnswer: 0,
        explanation: 'Propitiation is the sacrifice that turns away God\'s wrath, fulfilled by Christ.',
        bibleReference: 'Romans 3:25',
        points: 10
    },
    {
        id: 'q40',
        quizId: 'bible-concepts',
        text: 'What is "regeneration"?',
        options: ['Being born again', 'Church growth', 'Moral improvement', 'Physical healing'],
        correctAnswer: 0,
        explanation: 'Regeneration is the spiritual rebirth, being born again by the Holy Spirit.',
        bibleReference: 'Titus 3:5',
        points: 10
    },

    // ============================================
    // BIBLE VERSES - 10 questions @ 10 points = 100
    // (Added 8 more questions)
    // ============================================
    {
        id: 'q41',
        quizId: 'bible-verses',
        text: 'In which book do we find "The Lord is my shepherd"?',
        options: ['Isaiah', 'Psalms', 'Proverbs', 'Ecclesiastes'],
        correctAnswer: 1,
        explanation: 'This famous verse is found in Psalms 23:1.',
        bibleReference: 'Psalms 23:1',
        points: 10
    },
    {
        id: 'q42',
        quizId: 'bible-verses',
        text: 'What is the shortest verse in the Bible?',
        options: ['John 11:35', 'Luke 17:32', 'Genesis 1:1', 'Exodus 20:3'],
        correctAnswer: 0,
        explanation: 'John 11:35 says "Jesus wept."',
        bibleReference: 'John 11:35',
        points: 10
    },
    {
        id: 'q43',
        quizId: 'bible-verses',
        text: 'Where is the Great Commission found?',
        options: ['Matthew 28:18-20', 'Mark 16:15', 'Luke 24:47', 'All of the above'],
        correctAnswer: 3,
        explanation: 'The Great Commission is recorded in all four Gospels and Acts.',
        bibleReference: 'Matthew 28:18-20',
        points: 10
    },
    {
        id: 'q44',
        quizId: 'bible-verses',
        text: 'What is the longest chapter in the Bible?',
        options: ['Psalm 119', 'Isaiah 53', 'Genesis 1', 'Exodus 20'],
        correctAnswer: 0,
        explanation: 'Psalm 119 has 176 verses, making it the longest chapter.',
        bibleReference: 'Psalm 119',
        points: 10
    },
    {
        id: 'q45',
        quizId: 'bible-verses',
        text: 'Where is the Lord\'s Prayer found?',
        options: ['Matthew 6', 'Luke 11', 'Both Matthew and Luke', 'Mark 10'],
        correctAnswer: 2,
        explanation: 'The Lord\'s Prayer is found in Matthew 6:9-13 and Luke 11:2-4.',
        bibleReference: 'Matthew 6:9-13',
        points: 10
    },
    {
        id: 'q46',
        quizId: 'bible-verses',
        text: 'Which verse is known as the "Golden Rule"?',
        options: ['Matthew 7:12', 'John 3:16', 'Romans 8:28', 'Philippians 4:13'],
        correctAnswer: 0,
        explanation: 'So in everything, do to others what you would have them do to you.',
        bibleReference: 'Matthew 7:12',
        points: 10
    },
    {
        id: 'q47',
        quizId: 'bible-verses',
        text: 'Where is the Ten Commandments found?',
        options: ['Exodus 20', 'Deuteronomy 5', 'Both Exodus and Deuteronomy', 'Leviticus 19'],
        correctAnswer: 2,
        explanation: 'The Ten Commandments are recorded in Exodus 20 and Deuteronomy 5.',
        bibleReference: 'Exodus 20',
        points: 10
    },
    {
        id: 'q48',
        quizId: 'bible-verses',
        text: 'What is the middle verse of the Bible?',
        options: ['Psalm 118:8', 'Psalm 119:1', 'Proverbs 1:1', 'Isaiah 40:1'],
        correctAnswer: 0,
        explanation: 'Psalm 118:8 is the middle verse of the Bible.',
        bibleReference: 'Psalm 118:8',
        points: 10
    },
    {
        id: 'q49',
        quizId: 'bible-verses',
        text: 'Where is the Beatitudes found?',
        options: ['Matthew 5', 'Luke 6', 'Both Matthew and Luke', 'John 14'],
        correctAnswer: 2,
        explanation: 'The Beatitudes are found in Matthew 5:3-12 and Luke 6:20-23.',
        bibleReference: 'Matthew 5',
        points: 10
    },
    {
        id: 'q50',
        quizId: 'bible-verses',
        text: 'What is the most quoted verse in the Bible?',
        options: ['John 3:16', 'Psalm 23', 'Genesis 1:1', 'Romans 8:28'],
        correctAnswer: 0,
        explanation: 'John 3:16 is widely considered the most quoted and memorized verse.',
        bibleReference: 'John 3:16',
        points: 10
    },

    // ============================================
    // GENERAL BIBLE - 10 questions @ 10 points = 100
    // (Changed from 5 to 10 points, added 7 more questions)
    // ============================================
    {
        id: 'q51',
        quizId: 'general-bible',
        text: 'How many books are in the New Testament?',
        options: ['27', '39', '66', '73'],
        correctAnswer: 0,
        explanation: 'The New Testament contains 27 books.',
        bibleReference: '',
        points: 10
    },
    {
        id: 'q52',
        quizId: 'general-bible',
        text: 'How many books are in the Old Testament?',
        options: ['27', '39', '66', '73'],
        correctAnswer: 1,
        explanation: 'The Old Testament contains 39 books.',
        bibleReference: '',
        points: 10
    },
    {
        id: 'q53',
        quizId: 'general-bible',
        text: 'Who wrote the book of Acts?',
        options: ['Paul', 'Peter', 'Luke', 'John'],
        correctAnswer: 2,
        explanation: 'Luke wrote both the Gospel of Luke and the Acts of the Apostles.',
        bibleReference: 'Acts 1:1',
        points: 10
    },
    {
        id: 'q54',
        quizId: 'general-bible',
        text: 'How many gospels are in the New Testament?',
        options: ['1', '2', '3', '4'],
        correctAnswer: 3,
        explanation: 'The four gospels are Matthew, Mark, Luke, and John.',
        bibleReference: '',
        points: 10
    },
    {
        id: 'q55',
        quizId: 'general-bible',
        text: 'Who was the first murderer?',
        options: ['Cain', 'Abel', 'Adam', 'Lamech'],
        correctAnswer: 0,
        explanation: 'Cain killed his brother Abel.',
        bibleReference: 'Genesis 4:8',
        points: 10
    },
    {
        id: 'q56',
        quizId: 'general-bible',
        text: 'What language was most of the Old Testament written in?',
        options: ['Greek', 'Hebrew', 'Aramaic', 'Latin'],
        correctAnswer: 1,
        explanation: 'The Old Testament was primarily written in Hebrew.',
        bibleReference: '',
        points: 10
    },
    {
        id: 'q57',
        quizId: 'general-bible',
        text: 'What language was the New Testament written in?',
        options: ['Greek', 'Hebrew', 'Aramaic', 'Latin'],
        correctAnswer: 0,
        explanation: 'The New Testament was written in Koine Greek.',
        bibleReference: '',
        points: 10
    },
    {
        id: 'q58',
        quizId: 'general-bible',
        text: 'How many people were saved on Noah\'s ark?',
        options: ['4', '6', '8', '10'],
        correctAnswer: 2,
        explanation: 'Noah, his wife, his three sons, and their wives - 8 people total.',
        bibleReference: '1 Peter 3:20',
        points: 10
    },
    {
        id: 'q59',
        quizId: 'general-bible',
        text: 'Who was the wisest king of Israel?',
        options: ['David', 'Solomon', 'Saul', 'Hezekiah'],
        correctAnswer: 1,
        explanation: 'Solomon was known for his wisdom, given by God.',
        bibleReference: '1 Kings 4:29-34',
        points: 10
    },
    {
        id: 'q60',
        quizId: 'general-bible',
        text: 'What is the last book of the Bible?',
        options: ['Revelation', 'Jude', 'Acts', 'Malachi'],
        correctAnswer: 0,
        explanation: 'Revelation is the final book of the Bible.',
        bibleReference: '',
        points: 10
    }
];

export const getQuestionsByQuizId = (quizId: string): Question[] => {
    const quizQuestions = questions.filter(q => q.quizId === quizId);
    console.log(`Found ${quizQuestions.length} questions for ${quizId} (${quizQuestions.reduce((sum, q) => sum + q.points, 0)} total points)`);
    return quizQuestions;
};

export const getQuestionById = (id: string): Question | undefined => {
    return questions.find(q => q.id === id);
};