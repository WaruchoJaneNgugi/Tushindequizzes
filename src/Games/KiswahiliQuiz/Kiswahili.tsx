import { useState } from 'react';
import TakeExam from './views/TakeExam';
import type { Exam } from './types/exam';


const mockExam: Exam = {
  ExamID: 1, Title: "Bingwa wa Kiswahili", Subject: "Kiswahili", Code: "KSW-EXTENDED",
  levels: [
    { level: 1, questions: [
        { QuestionID: "1-1", QuestionText: "Wingi wa 'Jicho' ni?", OptionA: "Macho", OptionB: "Majicho", OptionC: "Vicho", OptionD: "Mijicho", CorrectAnswer: "A" },
        { QuestionID: "1-2", QuestionText: "Kinyume cha 'Nje' ni?", OptionA: "Mbali", OptionB: "Ndani", OptionC: "Chini", OptionD: "Kando", CorrectAnswer: "B" },
        { QuestionID: "1-3", QuestionText: "Rangi ya damu ni?", OptionA: "Kijani", OptionB: "Nyekundu", OptionC: "Nyeupe", OptionD: "Nyeusi", CorrectAnswer: "B" },
        { QuestionID: "1-4", QuestionText: "Mtu anayetibu wagonjwa ni?", OptionA: "Nesi", OptionB: "Daktari", OptionC: "Mwalimu", OptionD: "Dereva", CorrectAnswer: "B" },
        { QuestionID: "1-5", QuestionText: "Salama ya asubuhi?", OptionA: "Habari ya jioni", OptionB: "Sabalkheri", OptionC: "Masalkheri", OptionD: "Lala salama", CorrectAnswer: "B" },
        { QuestionID: "1-6", QuestionText: "Chakula cha asubuhi ni?", OptionA: "Chajio", OptionB: "Kifungua kinywa", OptionC: "Mlo", OptionD: "Kiwavi", CorrectAnswer: "B" },
        { QuestionID: "1-7", QuestionText: "Kinyume cha 'Nenda'?", OptionA: "Kuja", OptionB: "Njoo", OptionC: "Fika", OptionD: "Ondoka", CorrectAnswer: "B" },
        { QuestionID: "1-8", QuestionText: "Mtu anayesafiri baharini?", OptionA: "Baharia", OptionB: "Rubani", OptionC: "Dereva", OptionD: "Mtembezi", CorrectAnswer: "A" },
        { QuestionID: "1-9", QuestionText: "Siku ya kwanza ya wiki (Kikristo)?", OptionA: "Jumapili", OptionB: "Jumatatu", OptionC: "Ijumaa", OptionD: "Jumamosi", CorrectAnswer: "B" },
        { QuestionID: "1-10", QuestionText: "Mzazi wa kike ni?", OptionA: "Baba", OptionB: "Mama", OptionC: "Dada", OptionD: "Kaka", CorrectAnswer: "B" }
      ]},
    { level: 2, questions: [
        { QuestionID: "2-1", QuestionText: "Nomino 'Maji' iko katika ngeli gani?", OptionA: "U-I", OptionB: "YA-YA", OptionC: "LI-YA", OptionD: "A-WA", CorrectAnswer: "C" },
        { QuestionID: "2-2", QuestionText: "Gari linaenda ____ barabara.", OptionA: "Kando ya", OptionB: "Katikati ya", OptionC: "Juu ya", OptionD: "Mbele ya", CorrectAnswer: "B" },
        { QuestionID: "2-3", QuestionText: "Wingi wa 'Mwalimu' ni?", OptionA: "Mawalimu", OptionB: "Walimu", OptionC: "Waalimu", OptionD: "Mwalimu", CorrectAnswer: "B" },
        { QuestionID: "2-4", QuestionText: "Kiti ____ kimevunjika.", OptionD: "Zile", OptionB: "Hiki", OptionC: "Hili", OptionA: "Hivi", CorrectAnswer: "B" },
        { QuestionID: "2-5", QuestionText: "Ngeli ya neno 'Ulimi'?", OptionA: "U-I", OptionB: "U-ZI", OptionC: "I-ZI", OptionD: "LI-YA", CorrectAnswer: "B" },
        { QuestionID: "2-6", QuestionText: "Wingi wa 'Kalamu' ni?", OptionA: "Makalamu", OptionB: "Kalamu", OptionC: "Vikalamu", OptionD: "Ukalamu", CorrectAnswer: "B" },
        { QuestionID: "2-7", QuestionText: "Kivumishi cha sifa: Mtu ____?", OptionA: "Mvivu", OptionB: "Kivivu", OptionC: "Vivivu", OptionD: "Uvivu", CorrectAnswer: "A" },
        { QuestionID: "2-8", QuestionText: "Neno 'Yeye' ni aina gani ya neno?", OptionA: "Nomino", OptionB: "Kiwakilishi", OptionC: "Kivumishi", OptionD: "Kielezi", CorrectAnswer: "B" },
        { QuestionID: "2-9", QuestionText: "Watu ____ wamefika.", OptionA: "Wengi", OptionB: "Mengi", OptionC: "Pengi", OptionD: "Zingi", CorrectAnswer: "A" },
        { QuestionID: "2-10", QuestionText: "Ngeli ya 'Dawati'?", OptionA: "U-I", OptionB: "LI-YA", OptionC: "I-ZI", OptionD: "A-WA", CorrectAnswer: "B" }
      ]},
    { level: 3, questions: [
        { QuestionID: "3-1", QuestionText: "Akili ni ____?", OptionA: "Nguvu", OptionB: "Mali", OptionC: "Bora", OptionD: "Pesa", CorrectAnswer: "B" },
        { QuestionID: "3-2", QuestionText: "Askari mlangoni ni?", OptionA: "Mbwa", OptionB: "Kufuli", OptionC: "Paka", OptionD: "Mlango", CorrectAnswer: "B" },
        { QuestionID: "3-3", QuestionText: "Haba na haba hujaza ____?", OptionA: "Chungu", OptionB: "Kibaba", OptionC: "Pishi", OptionD: "Gunia", CorrectAnswer: "B" },
        { QuestionID: "3-4", QuestionText: "Mchimba kaburi huingia ____?", OptionA: "Mwenyewe", OptionB: "Na jembe", OptionC: "Na maiti", OptionD: "Na huzuni", CorrectAnswer: "A" },
        { QuestionID: "3-5", QuestionText: "Kitendawili: Kuku wangu ametagia miba?", OptionA: "Nanasi", OptionB: "Chungwa", OptionC: "Tikiti", OptionD: "Embe", CorrectAnswer: "A" },
        { QuestionID: "3-6", QuestionText: "Pole pole ndio ____?", OptionA: "Mwendo", OptionB: "Haraka", OptionC: "Kufika", OptionD: "Salama", CorrectAnswer: "A" },
        { QuestionID: "3-7", QuestionText: "Asiyesikia la mkuu huona la ____?", OptionA: "Mungu", OptionB: "Mvua", OptionC: "Mvuvumivu", OptionD: "Mkuu mwenzake", CorrectAnswer: "B" },
        { QuestionID: "3-8", QuestionText: "Kizungumkuti ni nini?", OptionA: "Tatizo gumu", OptionB: "Mchezo", OptionC: "Mti", OptionD: "Sauti", CorrectAnswer: "A" },
        { QuestionID: "3-9", QuestionText: "Baada ya dhiki ni ____?", OptionA: "Faraja", OptionB: "Shida", OptionC: "Kazi", OptionD: "Mauti", CorrectAnswer: "A" },
        { QuestionID: "3-10", QuestionText: "Maji yakimwagika hayazoleki. Maana yake?", OptionA: "Usipoteze maji", OptionB: "Kilichoharibika hakiwezi kurekebishika", OptionC: "Maji ni uhai", OptionD: "Jihadhari na maji", CorrectAnswer: "B" }
      ]},
    { level: 4, questions: [
        { QuestionID: "4-1", QuestionText: "Mpole kama ____?", OptionA: "Sungura", OptionB: "Kondoo", OptionC: "Simba", OptionD: "Paka", CorrectAnswer: "B" },
        { QuestionID: "4-2", QuestionText: "Haraka haraka haina ____?", OptionA: "Kazi", OptionB: "Baraka", OptionC: "Mwisho", OptionD: "Mafanikio", CorrectAnswer: "B" },
        { QuestionID: "4-3", QuestionText: "Sentensi 'Kitabu kimesomwa' iko katika kauli ya?", OptionA: "Kutenda", OptionB: "Kutendwa", OptionC: "Kutendea", OptionD: "Kutendeana", CorrectAnswer: "B" },
        { QuestionID: "4-4", QuestionText: "Neno 'Mkimbiaji' limetokana na kitendo?", OptionA: "Mbio", OptionB: "Kukimbia", OptionC: "Kukimbiza", OptionD: "Mkimbio", CorrectAnswer: "B" },
        { QuestionID: "4-5", QuestionText: "Umoja wa neno 'Macho' ni?", OptionA: "Chicho", OptionB: "Jicho", OptionC: "Kicho", OptionD: "Ucho", CorrectAnswer: "B" },
        { QuestionID: "4-6", QuestionText: "Kamilisha: Kupanda mchongoma ____?", OptionA: "Kushuka ndio ngoma", OptionB: "Ni kazi", OptionC: "Huwezi", OptionD: "Utumia nguvu", CorrectAnswer: "A" },
        { QuestionID: "4-7", QuestionText: "Tashbihi: Mwaminifu kama ____?", OptionA: "Njiwa", OptionB: "Kalamu", OptionC: "Mbwa", OptionD: "Simba", CorrectAnswer: "B" },
        { QuestionID: "4-8", QuestionText: "Mtu anayependa kula sana?", OptionA: "Mroho", OptionB: "Mkata", OptionC: "Mvivu", OptionD: "Mkimya", CorrectAnswer: "A" },
        { QuestionID: "4-9", QuestionText: "Siku iliyopita jana?", OptionA: "Juzi", OptionB: "Mtondo", OptionC: "Kesho", OptionD: "Kutwa", CorrectAnswer: "A" },
        { QuestionID: "4-10", QuestionText: "Maana ya neno 'Dhamana'?", OptionA: "Ahadi", OptionB: "Udhamini", OptionC: "Pesa", OptionD: "Kazi", CorrectAnswer: "B" }
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


