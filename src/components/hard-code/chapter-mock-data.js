// src/mock-data/chapter-mock-data.jsx

export const chapterMockData = {
  "English": [
    {
      title: "Essay Writing",
      desc: "Techniques and examples of essays",
      time: "40 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What is an essay?",
          options: [
            { value: "A short story", isCorrect: "no" },
            { value: "A piece of writing", isCorrect: "yes" },
            { value: "A poem", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Which of these is essential for an essay?",
          options: [
            { value: "Plot and characters", isCorrect: "no" },
            { value: "Introduction and conclusion", isCorrect: "yes" },
            { value: "Rhyme and meter", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "What tone is usually used in essays?",
          options: [
            { value: "Formal and informative", isCorrect: "yes" },
            { value: "Informal and casual", isCorrect: "no" },
            { value: "Humorous and satirical", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "Which part of the essay presents the main idea?",
          options: [
            { value: "Conclusion", isCorrect: "no" },
            { value: "Body paragraphs", isCorrect: "yes" },
            { value: "Title", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "Which is NOT a type of essay?",
          options: [
            { value: "Descriptive", isCorrect: "no" },
            { value: "Narrative", isCorrect: "no" },
            { value: "Haiku", isCorrect: "yes" }
          ]
        }
      ]
    },
    {
      title: "Comprehension",
      desc: "Reading and understanding passages",
      time: "35 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What is the main purpose of comprehension?",
          options: [
            { value: "To memorize text", isCorrect: "no" },
            { value: "To understand and interpret", isCorrect: "yes" },
            { value: "To write summaries", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "What does inference mean in comprehension?",
          options: [
            { value: "Directly stated facts", isCorrect: "no" },
            { value: "Guessing meaning", isCorrect: "no" },
            { value: "Drawing conclusions from clues", isCorrect: "yes" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Which question tests literal understanding?",
          options: [
            { value: "Why did the character act?", isCorrect: "no" },
            { value: "What happened first?", isCorrect: "yes" },
            { value: "What does the author imply?", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "How can comprehension skills be improved?",
          options: [
            { value: "By reading regularly", isCorrect: "yes" },
            { value: "By ignoring unknown words", isCorrect: "no" },
            { value: "By skipping hard passages", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "What is a summary?",
          options: [
            { value: "A detailed explanation", isCorrect: "no" },
            { value: "A brief restatement", isCorrect: "yes" },
            { value: "An opinion piece", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Grammar",
      desc: "Tenses, punctuation, and sentence structure",
      time: "30 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What is the past tense of 'go'?",
          options: [
            { value: "Goed", isCorrect: "no" },
            { value: "Went", isCorrect: "yes" },
            { value: "Gone", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Which punctuation mark ends a question?",
          options: [
            { value: "Period", isCorrect: "no" },
            { value: "Exclamation mark", isCorrect: "no" },
            { value: "Question mark", isCorrect: "yes" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Which word is a noun?",
          options: [
            { value: "Run", isCorrect: "no" },
            { value: "Happiness", isCorrect: "yes" },
            { value: "Quickly", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "Which sentence is correct?",
          options: [
            { value: "He don't like apples.", isCorrect: "no" },
            { value: "He doesn't like apples.", isCorrect: "yes" },
            { value: "He not like apples.", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "What is the plural of 'child'?",
          options: [
            { value: "Childs", isCorrect: "no" },
            { value: "Children", isCorrect: "yes" },
            { value: "Childes", isCorrect: "no" }
          ]
        }
      ]
    }
  ],

  "Urdu": [
    {
      title: "Mazmoon Nigari",
      desc: "Essay writing in Urdu",
      time: "40 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "مضمون کیا ہے؟",
          options: [
            { value: "ایک کہانی", isCorrect: "no" },
            { value: "ایک تحریر", isCorrect: "yes" },
            { value: "ایک نظم", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "مضمون میں کیا شامل ہوتا ہے؟",
          options: [
            { value: "تعارف اور اختتام", isCorrect: "yes" },
            { value: "گانے کے بول", isCorrect: "no" },
            { value: "کہانی کے کردار", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "مضمون لکھتے وقت لہجہ کیسا ہوتا ہے؟",
          options: [
            { value: "رسمی اور معلوماتی", isCorrect: "yes" },
            { value: "مزاحیہ", isCorrect: "no" },
            { value: "دوستی بھرا", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "مضمون کا کون سا حصہ مرکزی خیال پیش کرتا ہے؟",
          options: [
            { value: "ابتدائیہ", isCorrect: "no" },
            { value: "متن", isCorrect: "yes" },
            { value: "عنوان", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "مندرجہ ذیل میں سے کون سا مضمون کی قسم نہیں ہے؟",
          options: [
            { value: "بیانیہ", isCorrect: "no" },
            { value: "تفصیلی", isCorrect: "no" },
            { value: "غزل", isCorrect: "yes" }
          ]
        }
      ]
    },
    {
      title: "Nazm",
      desc: "Poetry appreciation and explanation",
      time: "35 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "نظم کیا ہوتی ہے؟",
          options: [
            { value: "ایک نظم", isCorrect: "yes" },
            { value: "ایک کہانی", isCorrect: "no" },
            { value: "ایک مضمون", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "نظم کی خاص بات کیا ہوتی ہے؟",
          options: [
            { value: "بند بندی اور وزن", isCorrect: "yes" },
            { value: "بیانیہ انداز", isCorrect: "no" },
            { value: "غزل کا حصہ", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "نظم میں کونسے عناصر شامل ہوتے ہیں؟",
          options: [
            { value: "قافیہ اور ردیف", isCorrect: "yes" },
            { value: "ناول", isCorrect: "no" },
            { value: "ڈرامہ", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "نظم کس زبان میں لکھی جاتی ہے؟",
          options: [
            { value: "صرف اردو", isCorrect: "no" },
            { value: "کسی بھی زبان", isCorrect: "yes" },
            { value: "صرف انگریزی", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "نظم اور غزل میں کیا فرق ہے؟",
          options: [
            { value: "نظم آزاد انداز میں ہوتی ہے", isCorrect: "yes" },
            { value: "غزل نظم کی ایک قسم ہے", isCorrect: "no" },
            { value: "دونوں میں کوئی فرق نہیں", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Ghazal",
      desc: "Understanding classical Ghazals",
      time: "30 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "غزل کیا ہے؟",
          options: [
            { value: "شاعری کی ایک صنف", isCorrect: "yes" },
            { value: "ایک ناول", isCorrect: "no" },
            { value: "ایک ڈرامہ", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "غزل میں کیا خاص ہوتا ہے؟",
          options: [
            { value: "قافیہ اور ردیف", isCorrect: "yes" },
            { value: "قصہ گوئی", isCorrect: "no" },
            { value: "مکالمہ", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "غزل کا موضوع کیا ہو سکتا ہے؟",
          options: [
            { value: "محبت اور جذبات", isCorrect: "yes" },
            { value: "تاریخی واقعات", isCorrect: "no" },
            { value: "سائنس", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "غزل کے اشعار کیسے ہوتے ہیں؟",
          options: [
            { value: "مستقل قافیہ پر", isCorrect: "yes" },
            { value: "بغیر قافیہ کے", isCorrect: "no" },
            { value: "مختصر اور نثر میں", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "غزل کی سب سے مشہور شاعر کون ہے؟",
          options: [
            { value: "میر تقی میر", isCorrect: "yes" },
            { value: "علامہ اقبال", isCorrect: "no" },
            { value: "جون ایلیا", isCorrect: "no" }
          ]
        }
      ]
    }
  ],

  "Islamiat": [
    {
      title: "Seerat-un-Nabi",
      desc: "Life of Prophet Muhammad (PBUH)",
      time: "40 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "رسول اللہ صلی اللہ علیہ وسلم کا پہلا پیغام کیا تھا؟",
          options: [
            { value: "توحید", isCorrect: "yes" },
            { value: "جہاد", isCorrect: "no" },
            { value: "صدقات", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "حضرت محمد صلی اللہ علیہ وسلم کہاں پیدا ہوئے؟",
          options: [
            { value: "مدینہ", isCorrect: "no" },
            { value: "مکہ", isCorrect: "yes" },
            { value: "بغداد", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "پیغمبر اسلام کی والدہ کا نام کیا تھا؟",
          options: [
            { value: "آمنہ", isCorrect: "yes" },
            { value: "فاطمہ", isCorrect: "no" },
            { value: "خدیجہ", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "پیغمبر اسلام نے کتنے سال تبلیغ کی؟",
          options: [
            { value: "23 سال", isCorrect: "yes" },
            { value: "40 سال", isCorrect: "no" },
            { value: "10 سال", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "پیغمبر اسلام کا سب سے پہلا صحابی کون تھا؟",
          options: [
            { value: "ابوبکر صدیق", isCorrect: "yes" },
            { value: "عمر فاروق", isCorrect: "no" },
            { value: "علی رضی اللہ عنہ", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Islamic History",
      desc: "Major events in Islamic history",
      time: "35 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "فتح مکہ کب ہوئی؟",
          options: [
            { value: "8 ہجری", isCorrect: "yes" },
            { value: "6 ہجری", isCorrect: "no" },
            { value: "10 ہجری", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "کس خلیفہ کے دور میں اسلامی سلطنت سب سے بڑی ہوئی؟",
          options: [
            { value: "عثمان غنی", isCorrect: "no" },
            { value: "عمر فاروق", isCorrect: "yes" },
            { value: "ابوبکر صدیق", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "جنگ بدر کب ہوئی؟",
          options: [
            { value: "2 ہجری", isCorrect: "yes" },
            { value: "5 ہجری", isCorrect: "no" },
            { value: "1 ہجری", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "اولین مسجد کہاں بنی؟",
          options: [
            { value: "مدینہ", isCorrect: "yes" },
            { value: "مکہ", isCorrect: "no" },
            { value: "کوفہ", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "حضرت علی رضی اللہ عنہ کا لقب کیا تھا؟",
          options: [
            { value: "ابوالحسن", isCorrect: "yes" },
            { value: "اسد اللہ", isCorrect: "no" },
            { value: "خلیفۃ الراشدین", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Quranic Teachings",
      desc: "Verses and interpretations",
      time: "30 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "قرآن مجید کی پہلی آیت کون سی ہے؟",
          options: [
            { value: "اقرأ باسم ربک", isCorrect: "yes" },
            { value: "الحمد للہ رب العالمین", isCorrect: "no" },
            { value: "یہ دینِ اسلام ہے", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "قرآن مجید کی کتنی سورتیں ہیں؟",
          options: [
            { value: "114", isCorrect: "yes" },
            { value: "120", isCorrect: "no" },
            { value: "100", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "سب سے طویل سورہ کون سی ہے؟",
          options: [
            { value: "البقرہ", isCorrect: "yes" },
            { value: "الکہف", isCorrect: "no" },
            { value: "الفاتحہ", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "قرآن مجید کا نزول کہاں ہوا؟",
          options: [
            { value: "مکہ", isCorrect: "yes" },
            { value: "مدینہ", isCorrect: "no" },
            { value: "بغداد", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "قرآن میں سب سے زیادہ کس موضوع پر بات ہوئی ہے؟",
          options: [
            { value: "توحید", isCorrect: "yes" },
            { value: "علم", isCorrect: "no" },
            { value: "تاریخ", isCorrect: "no" }
          ]
        }
      ]
    }
  ],

  "Pakistan Studies": [
    {
      title: "Ideology of Pakistan",
      desc: "Two-nation theory and independence",
      time: "40 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "پاکستان کا نظریہ کیا ہے؟",
          options: [
            { value: "دو قوموں کا نظریہ", isCorrect: "yes" },
            { value: "ایک قوم کا نظریہ", isCorrect: "no" },
            { value: "سیاسی نظریہ", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "پاکستان کب قائم ہوا؟",
          options: [
            { value: "1947", isCorrect: "yes" },
            { value: "1950", isCorrect: "no" },
            { value: "1930", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "پاکستان کے بانی کون ہیں؟",
          options: [
            { value: "قائداعظم محمد علی جناح", isCorrect: "yes" },
            { value: "علامہ اقبال", isCorrect: "no" },
            { value: "لیاقت علی خان", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "دو قوموں کے نظریے کا مقصد کیا تھا؟",
          options: [
            { value: "ہندو اور مسلمان علیحدہ قومیں ہیں", isCorrect: "yes" },
            { value: "پاکستان کی سرحدیں طے کرنا", isCorrect: "no" },
            { value: "سیاسی اتحاد", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "پاکستان کا پرچم کب اپنایا گیا؟",
          options: [
            { value: "1947", isCorrect: "yes" },
            { value: "1956", isCorrect: "no" },
            { value: "1965", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Geography of Pakistan",
      desc: "Land, climate, and resources",
      time: "35 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "پاکستان کا سب سے بڑا صوبہ کون سا ہے؟",
          options: [
            { value: "بلوچستان", isCorrect: "yes" },
            { value: "سندھ", isCorrect: "no" },
            { value: "پنجاب", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "پاکستان کی سب سے لمبی دریا کون سی ہے؟",
          options: [
            { value: "دریائے سندھ", isCorrect: "yes" },
            { value: "دریائے چناب", isCorrect: "no" },
            { value: "دریائے جہلم", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "پاکستان کا دارالحکومت کہاں ہے؟",
          options: [
            { value: "اسلام آباد", isCorrect: "yes" },
            { value: "کراچی", isCorrect: "no" },
            { value: "لاہور", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "پاکستان کا سب سے بلند پہاڑ کون سا ہے؟",
          options: [
            { value: "کے ٹو", isCorrect: "yes" },
            { value: "ننگا پربت", isCorrect: "no" },
            { value: "راکا پوشی", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "پاکستان کا کل رقبہ تقریباً کتنا ہے؟",
          options: [
            { value: "796,000 مربع کلومیٹر", isCorrect: "yes" },
            { value: "500,000 مربع کلومیٹر", isCorrect: "no" },
            { value: "1,000,000 مربع کلومیٹر", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Economy of Pakistan",
      desc: "Industries and agriculture",
      time: "30 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "پاکستان کی معیشت کا سب سے بڑا حصہ کون سا ہے؟",
          options: [
            { value: "زراعت", isCorrect: "yes" },
            { value: "صنعت", isCorrect: "no" },
            { value: "خدمات", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "پاکستان کا سب سے اہم فصل کون سی ہے؟",
          options: [
            { value: "گندم", isCorrect: "yes" },
            { value: "چاول", isCorrect: "no" },
            { value: "گنا", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "پاکستان کا مرکزی صنعتی شہر کون سا ہے؟",
          options: [
            { value: "کراچی", isCorrect: "yes" },
            { value: "لاہور", isCorrect: "no" },
            { value: "فیصل آباد", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "پاکستان کی کرنسی کیا ہے؟",
          options: [
            { value: "روپیہ", isCorrect: "yes" },
            { value: "ڈالر", isCorrect: "no" },
            { value: "پاؤنڈ", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "پاکستان کی معیشت میں کون سا شعبہ سب سے تیزی سے بڑھ رہا ہے؟",
          options: [
            { value: "ٹیکنالوجی", isCorrect: "yes" },
            { value: "زراعت", isCorrect: "no" },
            { value: "صنعت", isCorrect: "no" }
          ]
        }
      ]
    }
  ],

  "Mathematics": [
    {
      title: "Algebra",
      desc: "Equations and inequalities",
      time: "40 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What is the solution to x + 3 = 7?",
          options: [
            { value: "x = 10", isCorrect: "no" },
            { value: "x = 4", isCorrect: "yes" },
            { value: "x = -4", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Which is an example of inequality?",
          options: [
            { value: "x = 5", isCorrect: "no" },
            { value: "x > 3", isCorrect: "yes" },
            { value: "x + y = 10", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "What is 2x when x = 3?",
          options: [
            { value: "5", isCorrect: "no" },
            { value: "6", isCorrect: "yes" },
            { value: "9", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "Which is a quadratic equation?",
          options: [
            { value: "x^2 + 5x + 6 = 0", isCorrect: "yes" },
            { value: "2x + 3 = 7", isCorrect: "no" },
            { value: "x - 4 = 0", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "What does the term 'coefficient' mean?",
          options: [
            { value: "Variable", isCorrect: "no" },
            { value: "Number multiplying variable", isCorrect: "yes" },
            { value: "Exponent", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Geometry",
      desc: "Shapes and measurements",
      time: "35 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "How many sides does a triangle have?",
          options: [
            { value: "3", isCorrect: "yes" },
            { value: "4", isCorrect: "no" },
            { value: "5", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "What is the sum of angles in a triangle?",
          options: [
            { value: "180 degrees", isCorrect: "yes" },
            { value: "90 degrees", isCorrect: "no" },
            { value: "360 degrees", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "What shape has all sides equal and angles 90 degrees?",
          options: [
            { value: "Square", isCorrect: "yes" },
            { value: "Rectangle", isCorrect: "no" },
            { value: "Rhombus", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "What do you call a polygon with 8 sides?",
          options: [
            { value: "Octagon", isCorrect: "yes" },
            { value: "Hexagon", isCorrect: "no" },
            { value: "Pentagon", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "What is the radius of a circle?",
          options: [
            { value: "Distance across the circle", isCorrect: "no" },
            { value: "Distance from center to edge", isCorrect: "yes" },
            { value: "Circumference", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Trigonometry",
      desc: "Angles and functions",
      time: "30 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What is sin(90 degrees)?",
          options: [
            { value: "0", isCorrect: "no" },
            { value: "1", isCorrect: "yes" },
            { value: "0.5", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Which function is adjacent/hypotenuse?",
          options: [
            { value: "Sine", isCorrect: "no" },
            { value: "Cosine", isCorrect: "yes" },
            { value: "Tangent", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Tan(45 degrees) equals?",
          options: [
            { value: "1", isCorrect: "yes" },
            { value: "0", isCorrect: "no" },
            { value: "√2", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "Trigonometry is used to study what?",
          options: [
            { value: "Circles", isCorrect: "no" },
            { value: "Triangles", isCorrect: "yes" },
            { value: "Squares", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "Which is NOT a trig function?",
          options: [
            { value: "Secant", isCorrect: "no" },
            { value: "Cotangent", isCorrect: "no" },
            { value: "Logarithm", isCorrect: "yes" }
          ]
        }
      ]
    }
  ],

  "Physics": [
    {
      title: "Kinematics",
      desc: "Motion in one and two dimensions",
      time: "45 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What is velocity?",
          options: [
            { value: "Speed with direction", isCorrect: "yes" },
            { value: "Speed only", isCorrect: "no" },
            { value: "Distance travelled", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Acceleration is the rate of change of?",
          options: [
            { value: "Velocity", isCorrect: "yes" },
            { value: "Speed", isCorrect: "no" },
            { value: "Displacement", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Unit of acceleration is?",
          options: [
            { value: "m/s", isCorrect: "no" },
            { value: "m/s²", isCorrect: "yes" },
            { value: "m²/s", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "An object at rest has?",
          options: [
            { value: "Zero velocity", isCorrect: "yes" },
            { value: "Constant velocity", isCorrect: "no" },
            { value: "Increasing velocity", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "Displacement is?",
          options: [
            { value: "Total path length", isCorrect: "no" },
            { value: "Shortest distance from start to end", isCorrect: "yes" },
            { value: "Distance in meters", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Dynamics",
      desc: "Forces and Newton’s laws",
      time: "50 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "Newton's First Law is also called?",
          options: [
            { value: "Law of inertia", isCorrect: "yes" },
            { value: "Law of acceleration", isCorrect: "no" },
            { value: "Law of action-reaction", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Force is measured in?",
          options: [
            { value: "Newtons", isCorrect: "yes" },
            { value: "Joules", isCorrect: "no" },
            { value: "Watts", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "What is mass?",
          options: [
            { value: "Amount of matter", isCorrect: "yes" },
            { value: "Weight", isCorrect: "no" },
            { value: "Force", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "Newton's Third Law states?",
          options: [
            { value: "Action equals reaction", isCorrect: "yes" },
            { value: "Force equals mass times acceleration", isCorrect: "no" },
            { value: "Objects stay at rest", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "Weight is?",
          options: [
            { value: "Mass times gravity", isCorrect: "yes" },
            { value: "Mass only", isCorrect: "no" },
            { value: "Force divided by acceleration", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Work and Energy",
      desc: "Energy concepts in physics",
      time: "40 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "Work is defined as?",
          options: [
            { value: "Force applied over distance", isCorrect: "yes" },
            { value: "Energy stored", isCorrect: "no" },
            { value: "Speed times time", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Unit of energy is?",
          options: [
            { value: "Joule", isCorrect: "yes" },
            { value: "Newton", isCorrect: "no" },
            { value: "Watt", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Kinetic energy depends on?",
          options: [
            { value: "Mass and velocity", isCorrect: "yes" },
            { value: "Mass only", isCorrect: "no" },
            { value: "Velocity only", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "Potential energy is energy due to?",
          options: [
            { value: "Position", isCorrect: "yes" },
            { value: "Motion", isCorrect: "no" },
            { value: "Temperature", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "Energy can be converted from one form to another?",
          options: [
            { value: "True", isCorrect: "yes" },
            { value: "False", isCorrect: "no" },
            { value: "Sometimes", isCorrect: "no" }
          ]
        }
      ]
    }
  ],

  "Chemistry": [
    {
      title: "Atomic Structure",
      desc: "Models of atoms and subatomic particles",
      time: "40 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What are protons?",
          options: [
            { value: "Positively charged particles", isCorrect: "yes" },
            { value: "Negatively charged particles", isCorrect: "no" },
            { value: "Neutral particles", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Electrons have what charge?",
          options: [
            { value: "Negative", isCorrect: "yes" },
            { value: "Positive", isCorrect: "no" },
            { value: "Neutral", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Neutrons have what charge?",
          options: [
            { value: "Neutral", isCorrect: "yes" },
            { value: "Positive", isCorrect: "no" },
            { value: "Negative", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "Atoms consist of?",
          options: [
            { value: "Protons, neutrons, and electrons", isCorrect: "yes" },
            { value: "Only protons", isCorrect: "no" },
            { value: "Only electrons", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "The nucleus of an atom contains?",
          options: [
            { value: "Protons and neutrons", isCorrect: "yes" },
            { value: "Electrons", isCorrect: "no" },
            { value: "Neutrons and electrons", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Chemical Bonding",
      desc: "Ionic, covalent, and metallic bonds",
      time: "35 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What is an ionic bond?",
          options: [
            { value: "Transfer of electrons", isCorrect: "yes" },
            { value: "Sharing of electrons", isCorrect: "no" },
            { value: "No electron movement", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Covalent bonds involve?",
          options: [
            { value: "Sharing electrons", isCorrect: "yes" },
            { value: "Losing electrons", isCorrect: "no" },
            { value: "Gaining electrons", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Metallic bonds are found in?",
          options: [
            { value: "Metals", isCorrect: "yes" },
            { value: "Non-metals", isCorrect: "no" },
            { value: "Gases", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "Ionic bonds result from?",
          options: [
            { value: "Opposite charges attraction", isCorrect: "yes" },
            { value: "Same charges repulsion", isCorrect: "no" },
            { value: "No charges", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "Which bond is strongest?",
          options: [
            { value: "Covalent bond", isCorrect: "yes" },
            { value: "Ionic bond", isCorrect: "no" },
            { value: "Metallic bond", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Thermochemistry",
      desc: "Heat changes in reactions",
      time: "30 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What is exothermic reaction?",
          options: [
            { value: "Releases heat", isCorrect: "yes" },
            { value: "Absorbs heat", isCorrect: "no" },
            { value: "No heat change", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "What is endothermic reaction?",
          options: [
            { value: "Absorbs heat", isCorrect: "yes" },
            { value: "Releases heat", isCorrect: "no" },
            { value: "No heat change", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Heat is a form of?",
          options: [
            { value: "Energy", isCorrect: "yes" },
            { value: "Matter", isCorrect: "no" },
            { value: "Force", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "Which law states energy conservation?",
          options: [
            { value: "First law of thermodynamics", isCorrect: "yes" },
            { value: "Second law of thermodynamics", isCorrect: "no" },
            { value: "Third law of thermodynamics", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "Unit of heat is?",
          options: [
            { value: "Calorie", isCorrect: "yes" },
            { value: "Watt", isCorrect: "no" },
            { value: "Joule", isCorrect: "no" }
          ]
        }
      ]
    }
  ],

  "Biology": [
    {
      title: "Cell Biology",
      desc: "Structure and function of cells",
      time: "40 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What is the basic unit of life?",
          options: [
            { value: "Cell", isCorrect: "yes" },
            { value: "Tissue", isCorrect: "no" },
            { value: "Organ", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Where is DNA found?",
          options: [
            { value: "Nucleus", isCorrect: "yes" },
            { value: "Cytoplasm", isCorrect: "no" },
            { value: "Cell membrane", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Which organelle produces energy?",
          options: [
            { value: "Mitochondria", isCorrect: "yes" },
            { value: "Ribosome", isCorrect: "no" },
            { value: "Golgi apparatus", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "What is photosynthesis?",
          options: [
            { value: "Process of making food using sunlight", isCorrect: "yes" },
            { value: "Breathing process", isCorrect: "no" },
            { value: "Water absorption", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "Cells are surrounded by?",
          options: [
            { value: "Cell membrane", isCorrect: "yes" },
            { value: "Cell wall", isCorrect: "no" },
            { value: "Chloroplast", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Genetics",
      desc: "DNA, genes, and heredity",
      time: "35 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What carries genetic information?",
          options: [
            { value: "DNA", isCorrect: "yes" },
            { value: "RNA", isCorrect: "no" },
            { value: "Proteins", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Genes are located on?",
          options: [
            { value: "Chromosomes", isCorrect: "yes" },
            { value: "Cells", isCorrect: "no" },
            { value: "Organelles", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Heredity is the passing of?",
          options: [
            { value: "Traits from parents to offspring", isCorrect: "yes" },
            { value: "Diseases", isCorrect: "no" },
            { value: "Energy", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "What is a mutation?",
          options: [
            { value: "Change in DNA sequence", isCorrect: "yes" },
            { value: "Cell division", isCorrect: "no" },
            { value: "Protein synthesis", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "Who discovered DNA structure?",
          options: [
            { value: "Watson and Crick", isCorrect: "yes" },
            { value: "Newton", isCorrect: "no" },
            { value: "Einstein", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Human Physiology",
      desc: "Systems of the human body",
      time: "30 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What organ pumps blood?",
          options: [
            { value: "Heart", isCorrect: "yes" },
            { value: "Lungs", isCorrect: "no" },
            { value: "Liver", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Where are red blood cells made?",
          options: [
            { value: "Bone marrow", isCorrect: "yes" },
            { value: "Heart", isCorrect: "no" },
            { value: "Kidneys", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "What is the function of lungs?",
          options: [
            { value: "Oxygen exchange", isCorrect: "yes" },
            { value: "Blood pumping", isCorrect: "no" },
            { value: "Digestion", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "Which system controls body functions?",
          options: [
            { value: "Nervous system", isCorrect: "yes" },
            { value: "Digestive system", isCorrect: "no" },
            { value: "Respiratory system", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "What carries messages in the body?",
          options: [
            { value: "Nerves", isCorrect: "yes" },
            { value: "Blood", isCorrect: "no" },
            { value: "Muscles", isCorrect: "no" }
          ]
        }
      ]
    }
  ],

  "Computer Science": [
    {
      title: "Introduction to Computers",
      desc: "Basics of computers",
      time: "30 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What is a computer?",
          options: [
            { value: "An electronic device", isCorrect: "yes" },
            { value: "A mechanical tool", isCorrect: "no" },
            { value: "A human organ", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "What does CPU stand for?",
          options: [
            { value: "Central Processing Unit", isCorrect: "yes" },
            { value: "Computer Personal Unit", isCorrect: "no" },
            { value: "Central Program Unit", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Which is an input device?",
          options: [
            { value: "Keyboard", isCorrect: "yes" },
            { value: "Monitor", isCorrect: "no" },
            { value: "Printer", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "What is software?",
          options: [
            { value: "Programs and applications", isCorrect: "yes" },
            { value: "Physical parts", isCorrect: "no" },
            { value: "Electricity", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "What does RAM do?",
          options: [
            { value: "Stores data temporarily", isCorrect: "yes" },
            { value: "Stores data permanently", isCorrect: "no" },
            { value: "Processes data", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Data Representation",
      desc: "Binary, octal, and hexadecimal systems",
      time: "25 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "Binary number system uses how many digits?",
          options: [
            { value: "2", isCorrect: "yes" },
            { value: "8", isCorrect: "no" },
            { value: "10", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "Octal number system is base?",
          options: [
            { value: "8", isCorrect: "yes" },
            { value: "10", isCorrect: "no" },
            { value: "2", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "Hexadecimal number system uses digits up to?",
          options: [
            { value: "15", isCorrect: "no" },
            { value: "16", isCorrect: "yes" },
            { value: "12", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "Which is NOT a number system?",
          options: [
            { value: "Binary", isCorrect: "no" },
            { value: "Decimal", isCorrect: "no" },
            { value: "Alphanumeric", isCorrect: "yes" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "Which system is used by computers internally?",
          options: [
            { value: "Binary", isCorrect: "yes" },
            { value: "Decimal", isCorrect: "no" },
            { value: "Octal", isCorrect: "no" }
          ]
        }
      ]
    },
    {
      title: "Programming Fundamentals",
      desc: "Basics of programming logic",
      time: "40 min",
      questions: [
        {
          id: 1,
          type: "single",
          question: "What is a programming language?",
          options: [
            { value: "A way to communicate with computers", isCorrect: "yes" },
            { value: "A hardware device", isCorrect: "no" },
            { value: "An operating system", isCorrect: "no" }
          ]
        },
        {
          id: 2,
          type: "single",
          question: "What does 'if' statement do?",
          options: [
            { value: "Conditional execution", isCorrect: "yes" },
            { value: "Loops", isCorrect: "no" },
            { value: "Variable declaration", isCorrect: "no" }
          ]
        },
        {
          id: 3,
          type: "single",
          question: "What is a variable?",
          options: [
            { value: "Storage for data", isCorrect: "yes" },
            { value: "Fixed value", isCorrect: "no" },
            { value: "Function", isCorrect: "no" }
          ]
        },
        {
          id: 4,
          type: "single",
          question: "What is debugging?",
          options: [
            { value: "Finding and fixing errors", isCorrect: "yes" },
            { value: "Writing code", isCorrect: "no" },
            { value: "Compiling", isCorrect: "no" }
          ]
        },
        {
          id: 5,
          type: "single",
          question: "What symbol ends a statement in many languages?",
          options: [
            { value: "Semicolon (;)", isCorrect: "yes" },
            { value: "Colon (:)", isCorrect: "no" },
            { value: "Comma (,)", isCorrect: "no" }
          ]
        }
      ]
    }
  ]
};
  
export default chapterMockData;
