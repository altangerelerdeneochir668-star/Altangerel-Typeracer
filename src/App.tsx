import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  Clock, 
  Flame, 
  ChevronRight, 
  BookOpen,
  HelpCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SENTENCES, Sentence } from './data/sentences';
import { playSound } from './utils/audio';

// Saved record format
interface HistoryRecord {
  id: string;
  date: string;
  sentenceTitle: string;
  wpm: number;
  accuracy: number;
  vehicleEmoji: string;
  competitorName: string;
  competitorEmoji: string;
  outcome: 'won' | 'lost' | 'practice';
}

const TRANSLATIONS = {
  mn: {
    title: "Typeracer MN",
    subtitle: "Бичих хурдны тэмцээн",
    bestWpm: "Шилдэг WPM",
    level: "Түвшин",
    grandmaster: "Грандмастер",
    master: "Мастер",
    pro: "Мэргэжил",
    beginner: "Шинэ Бичээч",
    selectText: "1. Текст сонгох",
    randomText: "Санамсаргүй текст солих",
    all: "Бүгд",
    short: "Богино",
    medium: "Дундаж",
    long: "Урт",
    selectVehicle: "2. Хөлгөө сонгох",
    selectCompetitor: "3. Өрсөлдөгч сонгох",
    raceSummary: "Уралдааны Тойм",
    selectedTextLabel: "Сонгосон Текст",
    yourVehicle: "Таны Хөлөг",
    yourCompetitor: "Өрсөлдөгч",
    startRaceBtn: "УРАЛДААНЫГ ЭХЛҮҮЛЭХ",
    recentRaces: "Сүүлийн уралдаанууд",
    emptyHistory: "Уралдааны түүх одоогоор хоосон байна.",
    clearHistory: "Түүх арилгах",
    speed: "Хурд",
    accuracy: "Нарийвчлал",
    errors: "Алдааны тоо",
    time: "Хугацаа",
    raceTrack: "🚦 УРАЛДААНЫ ЗАМ",
    finishLine: "Бариа",
    prepare: "Бэлтгээрэй!",
    countdownTitle: "УРАЛДААН ЭХЛЭХЭД",
    startTip: "Текст гарч ирэнгүүт доорх талбарт маш хурдан бичиж эхлээрэй.",
    inputPlaceholder: "Дээрх текстийг яг таг дуурайн бичнэ үү...",
    focusHelper: "💡 Дэлгэц дээр дурын газар дарахад бичих талбар автоматаар идэвхжинэ.",
    backBtn: "Буцах",
    victoryTitle: "БАРЯАНД ХҮРЛЭЭ!",
    wonText: "Та яллаа! Үнэхээр гайхалтай байлаа! 🎉",
    lostText: "Энэ удаад өрсөлдөгч таниас түрүүллээ. Дахин оролдоод үзээрэй! 💪",
    practiceText: "Сургалт амжилттай дууслаа! 🎯",
    statsWpm: "Бичих хурд",
    statsAccuracy: "Нарийвчлал",
    statsTime: "Нийт хугацаа",
    statsErrors: "Алдаа",
    correctHits: "Зөв даралт",
    secondsUnit: "секунд",
    timesUnit: "удаа",
    levelBadge: "Бичээчийн зэрэг",
    retryBtn: "Дахин уралдах",
    changeSettingsBtn: "Тохиргоо солих",
    helpTitle: "🏁 Typeracer тоглох заавар",
    instruction1: "Текст, уралдах хөлөг болон өрсөлдөгчөө сонгон 'УРАЛДААНЫГ ЭХЛҮҮЛЭХ' товчийг дарна.",
    instruction2: "3 секундын тоолол дуусахад гарч ирэх текстийг бичих хэсэгт алдаагүй, хурдан бичиж эхэлнэ.",
    instruction3: "Хэрэв та буруу үсэг дарвал текст улаан болно. Алдаа гаргасан хэсгийг Backspace дарж устгахгүй бол цааш үргэлжлүүлэн бичих боломжгүй бөгөөд хөлөг урагшлахгүй.",
    instruction4: "Текстийг бүрэн алдаагүй бичиж дуусгаснаар та барианы шугаманд хүрч уралдаан дуусна. Өөрийн хурдны түүхээ хадгалаарай!",
    closeBtn: "Ойлголоо, уралдая!",
    footerText: "© 2026 Typeracer Mongolian. Бүх эрх хамгаалагдсан.",
    muteText: "Дуутай",
    unmuteText: "Дуугүй",
    characterUnit: "тэмдэгт",
    correctErrorNote: "Алдаагаа засна уу! (Backspace)",
    sentenceLabel: "Эх бичвэр",
    legendarySpeed: "🔥 Домогт Хурдтан",
    majesticSpeed: "⚡ Сүрлэг Хурдтан",
    expertSpeed: "🚀 Мэргэшсэн Бичээч",
    rookieSpeed: "🌱 Анхан Шатных"
  },
  en: {
    title: "Typeracer EN",
    subtitle: "Typing Speed Battle",
    bestWpm: "Best WPM",
    level: "Rank",
    grandmaster: "Grandmaster",
    master: "Master",
    pro: "Professional",
    beginner: "Newbie Typer",
    selectText: "1. Select Text",
    randomText: "Change Random Text",
    all: "All",
    short: "Short",
    medium: "Medium",
    long: "Long",
    selectVehicle: "2. Select Ride",
    selectCompetitor: "3. Select Opponent",
    raceSummary: "Race Overview",
    selectedTextLabel: "Selected Text",
    yourVehicle: "Your Ride",
    yourCompetitor: "Opponent",
    startRaceBtn: "START THE RACE",
    recentRaces: "Recent Races",
    emptyHistory: "Your race history is currently empty.",
    clearHistory: "Clear",
    speed: "Speed",
    accuracy: "Accuracy",
    errors: "Error Count",
    time: "Duration",
    raceTrack: "🚦 RACE TRACK",
    finishLine: "Finish",
    prepare: "Get Ready!",
    countdownTitle: "RACE STARTS IN",
    startTip: "As soon as the text appears, type it into the input field as fast as possible.",
    inputPlaceholder: "Type the exact text displayed above...",
    focusHelper: "💡 Click anywhere on the screen to automatically focus the typing field.",
    backBtn: "Back",
    victoryTitle: "FINISHED!",
    wonText: "You won! That was absolutely amazing! 🎉",
    lostText: "Your opponent beat you this time. Try again! 💪",
    practiceText: "Practice session completed! 🎯",
    statsWpm: "Typing Speed",
    statsAccuracy: "Accuracy",
    statsTime: "Total Time",
    statsErrors: "Errors",
    correctHits: "Correct Hits",
    secondsUnit: "seconds",
    timesUnit: "times",
    levelBadge: "Typing Rank",
    retryBtn: "Race Again",
    changeSettingsBtn: "Change Settings",
    helpTitle: "🏁 How to Play Typeracer",
    instruction1: "Select a text, your racing vehicle, and an opponent, then press the 'START THE RACE' button.",
    instruction2: "When the 3-second countdown ends, start typing the displayed text accurately and as fast as you can.",
    instruction3: "If you type a wrong character, the text turns red. You must press Backspace to correct your mistakes before you can type further, and your vehicle won't move until fixed.",
    instruction4: "Completing the text fully and without errors brings you to the finish line to complete the race. Track your progress in the history!",
    closeBtn: "Understood, Let's Race!",
    footerText: "© 2026 Typeracer Mongolian. All rights reserved.",
    muteText: "Sound On",
    unmuteText: "Muted",
    characterUnit: "chars",
    correctErrorNote: "Correct your error! (Backspace)",
    sentenceLabel: "Target Text",
    legendarySpeed: "🔥 Legendary Typer",
    majesticSpeed: "⚡ Majestic Typer",
    expertSpeed: "🚀 Expert Typer",
    rookieSpeed: "🌱 Rookie Typer"
  }
};

const VEHICLES = [
  { id: 'horse', nameMn: 'Монгол Морь', nameEn: 'Mongolian Horse', emoji: '🐎', descriptionMn: 'Эрэмгий хурдан монгол морь', descriptionEn: 'Wild and fast Mongolian horse', speedRating: '⭐⭐⭐⭐' },
  { id: 'car', nameMn: 'Спорт Машин', nameEn: 'Sports Car', emoji: '🚗', descriptionMn: 'Орчин үеийн супер спорт машин', descriptionEn: 'Modern high-performance sports car', speedRating: '⭐⭐⭐⭐⭐' },
  { id: 'rocket', nameMn: 'Сансрын Хөлөг', nameEn: 'Space Rocket', emoji: '🚀', descriptionMn: 'Дуунаас хурдан пуужин хөлөг', descriptionEn: 'Supersonic deep-space rocket', speedRating: '⭐⭐⭐⭐⭐⭐' },
  { id: 'f1', nameMn: 'Формула 1', nameEn: 'Formula 1', emoji: '🏎️', descriptionMn: 'Мэргэжлийн уралдааны тэргүүн хөлөг', descriptionEn: 'Apex professional racing machine', speedRating: '⭐⭐⭐⭐⭐' },
  { id: 'ufo', nameMn: 'Нисдэг Таваг', nameEn: 'UFO', emoji: '🛸', descriptionMn: 'Харь гаригийн дэвшилтэт хөлөг', descriptionEn: 'Advanced interstellar spacecraft', speedRating: '⭐⭐⭐⭐⭐⭐⭐' },
];

const COMPETITORS = [
  { id: 'none', nameMn: 'Бэлтгэл (Өрсөлдөгчгүй)', nameEn: 'Practice Solo', emoji: '🎯', wpm: 0, descriptionMn: 'Өөрийнхөө хурдаар дасгалжих', descriptionEn: 'Practice and learn at your own pace' },
  { id: 'sloth', nameMn: 'Залхуу Хойлог', nameEn: 'Lazy Sloth', emoji: '🦥', wpm: 25, descriptionMn: 'Хөгжилтэй залхуу өрсөлдөгч (25 WPM)', descriptionEn: 'Slow and steady, loves napping (25 WPM)' },
  { id: 'rabbit', nameMn: 'Хурдан Туулай', nameEn: 'Speedy Rabbit', emoji: '🐇', wpm: 50, descriptionMn: 'Дундаж хурдтай тоглогч (50 WPM)', descriptionEn: 'Energetic mid-tier opponent (50 WPM)' },
  { id: 'leopard', nameMn: 'Цоохор Ирвэс', nameEn: 'Snow Leopard', emoji: '🐆', wpm: 80, descriptionMn: 'Туршлагатай өрсөлдөгч (80 WPM)', descriptionEn: 'Fierce and experienced typist (80 WPM)' },
  { id: 'flash', nameMn: 'Гэрлийн Хурд', nameEn: 'The Flash', emoji: '⚡', wpm: 110, descriptionMn: 'Домогт аварга бичээч (110 WPM)', descriptionEn: 'Legendary keyboard champion (110 WPM)' },
];

export default function App() {
  // Game states
  const [gameState, setGameState] = useState<'setup' | 'countdown' | 'playing' | 'completed'>('setup');
  const [lang, setLang] = useState<'mn' | 'en'>('mn');
  const [selectedSentence, setSelectedSentence] = useState<Sentence>(SENTENCES[0]);
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(COMPETITORS[2]); // Default is rabbit
  const [input, setInput] = useState('');
  
  // Audio state
  const [muted, setMuted] = useState(false);
  
  // Game stats
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [countdown, setCountdown] = useState(3);
  
  // Real-time tracking
  const [currentWpm, setCurrentWpm] = useState(0);
  const [botProgress, setBotProgress] = useState(0);
  
  // Local storage history
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  
  // Sentence browser filtering
  const [activeTab, setActiveTab] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  
  // Help Modal
  const [showHelp, setShowHelp] = useState(false);

  // References
  const inputRef = useRef<HTMLInputElement>(null);
  const trackingInterval = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('typeracer_mn_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
  }, []);

  // Set randomized sentence initially or on tab switch
  const selectRandomSentence = (category?: 'short' | 'medium' | 'long' | 'all', targetLang?: 'mn' | 'en') => {
    const activeLanguage = targetLang || lang;
    const activeCat = category || activeTab;

    let filtered = SENTENCES.filter(s => s.language === activeLanguage);
    if (activeCat && activeCat !== 'all') {
      filtered = filtered.filter(s => s.category === activeCat);
    }
    const rand = filtered[Math.floor(Math.random() * filtered.length)];
    if (rand) {
      setSelectedSentence(rand);
    }
  };

  const changeLanguage = (newLang: 'mn' | 'en') => {
    setLang(newLang);
    selectRandomSentence(activeTab, newLang);
  };

  // Run initial random sentence selection
  useEffect(() => {
    selectRandomSentence('all', 'mn');
  }, []);

  // Clear intervals on unmount
  useEffect(() => {
    return () => {
      if (trackingInterval.current) clearInterval(trackingInterval.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, []);

  // Handle countdown logic
  const startRace = () => {
    setInput('');
    setErrorCount(0);
    setTotalKeystrokes(0);
    setCurrentWpm(0);
    setBotProgress(0);
    setStartTime(null);
    setEndTime(null);
    setCountdown(3);
    setGameState('countdown');

    // Soft click to begin countdown
    playSound.click(muted);

    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current!);
          // Start the game!
          setGameState('playing');
          const now = Date.now();
          setStartTime(now);
          // Focus input in next tick
          setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
          }, 50);
          return 0;
        }
        playSound.click(muted);
        return prev - 1;
      });
    }, 1000);
  };

  // Calculate first mismatch index
  const getFirstErrorIndex = (currentInput: string, targetText: string): number => {
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] !== targetText[i]) {
        return i;
      }
    }
    return -1;
  };

  const firstErrorIndex = getFirstErrorIndex(input, selectedSentence.text);
  const hasError = firstErrorIndex !== -1;
  
  // Calculate player progress based on correctly matched character count
  const correctPrefixLength = hasError ? firstErrorIndex : input.length;
  const playerProgress = (correctPrefixLength / selectedSentence.text.length) * 100;

  // Real-time tracking of typing speed & bot progress
  useEffect(() => {
    if (gameState === 'playing' && startTime) {
      trackingInterval.current = setInterval(() => {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        if (elapsedSeconds <= 0) return;

        // Player live WPM
        // WPM = (correct chars / 5) / (elapsed time in minutes)
        const activeWpm = Math.round((correctPrefixLength / 5) / (elapsedSeconds / 60));
        setCurrentWpm(activeWpm);

        // Bot live progress
        if (selectedCompetitor.id !== 'none') {
          const botWpm = selectedCompetitor.wpm;
          const botCharsPerSecond = (botWpm * 5) / 60;
          const botTypedChars = botCharsPerSecond * elapsedSeconds;
          const botProg = Math.min(100, (botTypedChars / selectedSentence.text.length) * 100);
          setBotProgress(botProg);
        }
      }, 100);
    } else {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
    }

    return () => {
      if (trackingInterval.current) clearInterval(trackingInterval.current);
    };
  }, [gameState, startTime, correctPrefixLength, selectedCompetitor, selectedSentence.text.length]);

  // Handle keyboard inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing' || !startTime) return;

    const value = e.target.value;
    
    // Prevent typing beyond the length of the sentence
    if (value.length > selectedSentence.text.length) return;

    // Track statistics for accuracy and typo sound triggers
    if (value.length > input.length) {
      const typedChar = value[value.length - 1];
      const targetChar = selectedSentence.text[value.length - 1];
      setTotalKeystrokes(prev => prev + 1);

      if (typedChar !== targetChar) {
        setErrorCount(prev => prev + 1);
        playSound.error(muted);
      } else {
        playSound.click(muted);
      }
    } else if (value.length < input.length) {
      // User pressed backspace
      playSound.click(muted);
    }

    setInput(value);

    // Check if fully finished correctly
    if (value === selectedSentence.text) {
      const now = Date.now();
      setEndTime(now);
      setGameState('completed');
      playSound.victory(muted);

      // Save to local storage
      const finalElapsed = (now - startTime) / 1000;
      const finalWpm = Math.round((selectedSentence.text.length / 5) / (finalElapsed / 60));
      const calculatedAccuracy = Math.max(0, Math.min(100, Math.round(((totalKeystrokes + 1 - errorCount) / Math.max(1, totalKeystrokes + 1)) * 100)));

      let outcome: 'won' | 'lost' | 'practice' = 'practice';
      if (selectedCompetitor.id !== 'none') {
        outcome = botProgress >= 100 ? 'lost' : 'won';
      }

      const newRecord: HistoryRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(lang === 'mn' ? 'mn-MN' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        sentenceTitle: selectedSentence.title,
        wpm: finalWpm,
        accuracy: calculatedAccuracy,
        vehicleEmoji: selectedVehicle.emoji,
        competitorName: lang === 'mn' ? selectedCompetitor.nameMn : selectedCompetitor.nameEn,
        competitorEmoji: selectedCompetitor.emoji,
        outcome
      };

      const updatedHistory = [newRecord, ...history].slice(0, 10); // Keep top 10 recent
      setHistory(updatedHistory);
      localStorage.setItem('typeracer_mn_history', JSON.stringify(updatedHistory));
    }
  };

  // Helper to force focus input on typing box click
  const focusInput = () => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Reset/Restart Setup
  const resetToSetup = () => {
    setInput('');
    setErrorCount(0);
    setTotalKeystrokes(0);
    setCurrentWpm(0);
    setBotProgress(0);
    setStartTime(null);
    setEndTime(null);
    setGameState('setup');
  };

  // Filter sentences by category and language
  const filteredSentences = SENTENCES.filter(s => {
    const langMatch = s.language === lang;
    const catMatch = activeTab === 'all' || s.category === activeTab;
    return langMatch && catMatch;
  });

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('typeracer_mn_history');
  };

  // Render typing sentence character highlights
  const renderSentenceChars = () => {
    const chars = selectedSentence.text.split('');
    return chars.map((char, index) => {
      let charStyle = 'text-slate-400 transition-colors duration-150';
      
      if (firstErrorIndex === -1) {
        // No errors typed yet
        if (index < input.length) {
          charStyle = 'text-emerald-400 font-medium bg-emerald-950/20 border-b border-emerald-500/40';
        } else if (index === input.length) {
          charStyle = 'text-sky-300 font-bold bg-sky-500/10 border-b-2 border-sky-400 animate-pulse';
        }
      } else {
        // Mismatch exists
        if (index < firstErrorIndex) {
          charStyle = 'text-emerald-400 font-medium bg-emerald-950/20 border-b border-emerald-500/40';
        } else if (index >= firstErrorIndex && index < input.length) {
          // Bad characters typed are highlighted red
          charStyle = 'text-rose-100 font-semibold bg-rose-600/80 border-b border-rose-400';
        } else if (index === firstErrorIndex) {
          // This is the active character that is blocked
          charStyle = 'text-rose-400 font-semibold bg-rose-950/40 border-b-2 border-rose-500 animate-pulse';
        } else {
          // Untyped future letters
          charStyle = 'text-slate-500';
        }
      }

      // Spaces highlighted subtly for visualization if incorrect
      const displayChar = char === ' ' ? '␣' : char;
      const isSpace = char === ' ';

      return (
        <span 
          key={index} 
          className={`inline-block font-mono text-lg md:text-xl tracking-wide ${charStyle} ${isSpace ? 'px-[1px] opacity-70 font-sans' : ''}`}
          id={`char-${index}`}
        >
          {char === ' ' ? ' ' : char}
        </span>
      );
    });
  };

  // Final stats calculation
  const finalTimeSeconds = startTime && endTime ? (endTime - startTime) / 1000 : 0;
  const finalWpm = startTime && endTime ? Math.round((selectedSentence.text.length / 5) / (finalTimeSeconds / 60)) : 0;
  const finalAccuracy = Math.max(0, Math.min(100, Math.round(((totalKeystrokes - errorCount) / Math.max(1, totalKeystrokes)) * 100)));

  // Best WPM & Level Badge from local history
  const bestWpm = history.length > 0 ? Math.max(...history.map(h => h.wpm)) : 0;
  const t = TRANSLATIONS[lang];
  const currentLevel = bestWpm >= 80 ? t.legendarySpeed :
                       bestWpm >= 55 ? t.majesticSpeed :
                       bestWpm >= 35 ? t.expertSpeed : t.rookieSpeed;
  const levelColor = bestWpm >= 80 ? 'text-amber-400' :
                      bestWpm >= 55 ? 'text-indigo-400' :
                      bestWpm >= 35 ? 'text-emerald-400' : 'text-slate-400';

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 flex flex-col relative overflow-hidden" id="main-container">
      {/* Background visual ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-950/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-950/20 blur-[130px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="border-b border-slate-900/80 bg-[#0d0d11]/80 backdrop-blur-md relative z-10 py-5 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-5" id="header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-black text-xl text-white">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase text-indigo-400 flex items-center gap-2">
              Typeracer <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-mono">{lang === 'mn' ? 'MN' : 'EN'}</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Dynamic Best Stats and Settings controls in Header */}
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <div className="bg-[#121217] border border-slate-800 px-4 py-1.5 rounded-xl backdrop-blur-md text-center md:text-left min-w-[80px]">
            <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">{t.bestWpm}</p>
            <p className="text-lg font-mono font-bold text-indigo-400">{bestWpm > 0 ? bestWpm : '—'}</p>
          </div>
          <div className="bg-[#121217] border border-slate-800 px-4 py-1.5 rounded-xl backdrop-blur-md text-center md:text-left min-w-[100px]">
            <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">{t.level}</p>
            <p className={`text-lg font-mono font-bold ${levelColor}`}>{currentLevel}</p>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
            {/* Bilingual Switcher */}
            <div className="flex bg-black/40 border border-slate-800 p-0.5 rounded-xl select-none mr-1" id="lang-switcher">
              <button 
                onClick={() => changeLanguage('mn')}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer ${lang === 'mn' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                id="lang-btn-mn"
              >
                MN
              </button>
              <button 
                onClick={() => changeLanguage('en')}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer ${lang === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                id="lang-btn-en"
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setShowHelp(true)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
              title={t.helpTitle}
              id="help-btn"
            >
              <HelpCircle size={18} />
            </button>
            
            <button
              onClick={() => setMuted(!muted)}
              className={`p-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer ${muted ? 'bg-rose-950/20 text-rose-400 border border-rose-900/30' : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300'}`}
              title={muted ? t.unmuteText : t.muteText}
              id="mute-btn"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span className="hidden md:inline font-medium">{muted ? t.unmuteText : t.muteText}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6 relative z-10" id="main-content">
        
        {/* SETUP SCREEN */}
        {gameState === 'setup' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            id="setup-screen"
          >
            {/* Left columns for configurations */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* 1. Sentence Selectors */}
              <div className="rounded-2xl bg-[#121217]/80 border border-slate-800/80 p-6 backdrop-blur-xl shadow-xl shadow-black/30 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-indigo-400" />
                    <h3 className="font-semibold text-white tracking-wide">{t.selectText}</h3>
                  </div>
                  <button 
                    onClick={() => selectRandomSentence(activeTab, lang)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-all font-medium flex items-center gap-1.5 self-end cursor-pointer"
                    id="randomize-sentence-btn"
                  >
                    <RotateCcw size={12} /> {t.randomText}
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-[#0a0a0d] border border-slate-900 gap-1 p-1 rounded-xl" id="tabs-container">
                  {(['all', 'short', 'medium', 'long'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        selectRandomSentence(tab, lang);
                      }}
                      className={`flex-1 text-center py-2 text-xs md:text-sm font-medium rounded-lg transition-all capitalize cursor-pointer ${
                        activeTab === tab 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-semibold' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#121217]/30'
                      }`}
                      id={`tab-${tab}`}
                    >
                      {tab === 'all' && t.all}
                      {tab === 'short' && t.short}
                      {tab === 'medium' && t.medium}
                      {tab === 'long' && t.long}
                    </button>
                  ))}
                </div>

                {/* Grid list of sentences to browse */}
                <div className="max-h-[220px] overflow-y-auto pr-1 flex flex-col gap-2 rounded-lg bg-[#07070a]/50 p-2 border border-slate-800/40">
                  {filteredSentences.map((sentence) => (
                    <button
                      key={sentence.id}
                      onClick={() => setSelectedSentence(sentence)}
                      className={`w-full text-left p-3 rounded-xl transition-all border flex flex-col gap-1 cursor-pointer ${
                        selectedSentence.id === sentence.id
                          ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/5'
                          : 'bg-[#121217]/40 hover:bg-[#181820]/40 border-slate-800/60 hover:border-slate-700/60'
                      }`}
                      id={`sentence-card-${sentence.id}`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-semibold text-xs md:text-sm text-slate-200">{sentence.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-mono ${
                          sentence.category === 'short' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          sentence.category === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {sentence.category === 'short' ? t.short : sentence.category === 'medium' ? t.medium : t.long}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 italic font-sans leading-relaxed">
                        "{sentence.text}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Vehicle Selector */}
              <div className="rounded-2xl bg-[#121217]/80 border border-slate-800/80 p-6 backdrop-blur-xl shadow-xl shadow-black/30 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Flame size={20} className="text-amber-400 animate-pulse" />
                  <h3 className="font-semibold text-white tracking-wide">{t.selectVehicle}</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3" id="vehicle-grid">
                  {VEHICLES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer ${
                        selectedVehicle.id === v.id
                          ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.03] ring-1 ring-indigo-500/30'
                          : 'bg-[#121217]/40 hover:bg-[#181822]/50 border-slate-800/80 hover:border-slate-700'
                      }`}
                      id={`vehicle-${v.id}`}
                    >
                      <span className="text-3xl md:text-4xl animate-bounce-subtle">{v.emoji}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">{lang === 'mn' ? v.nameMn : v.nameEn}</span>
                        <span className="text-[9px] text-slate-500 mt-0.5">{v.speedRating}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Competitor Selector */}
              <div className="rounded-2xl bg-[#121217]/80 border border-slate-800/80 p-6 backdrop-blur-xl shadow-xl shadow-black/30 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Trophy size={20} className="text-emerald-400" />
                  <h3 className="font-semibold text-white tracking-wide">{t.selectCompetitor}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3" id="competitor-grid">
                  {COMPETITORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCompetitor(c)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer ${
                        selectedCompetitor.id === c.id
                          ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.03] ring-1 ring-indigo-500/30'
                          : 'bg-[#121217]/40 hover:bg-[#181822]/50 border-slate-800/80 hover:border-slate-700'
                      }`}
                      id={`competitor-${c.id}`}
                    >
                      <span className="text-2xl md:text-3xl">{c.emoji}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">{lang === 'mn' ? c.nameMn : c.nameEn}</span>
                        <span className="text-[10px] text-indigo-400 font-mono mt-0.5">
                          {c.wpm > 0 ? `${c.wpm} WPM` : (lang === 'mn' ? 'Ганцаараа' : 'Practice')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar: Summary & Start Button + History */}
            <div className="flex flex-col gap-6">
              
              {/* Action Board */}
              <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 via-[#121217]/90 to-purple-950/40 border border-indigo-500/20 p-6 shadow-2xl flex flex-col gap-5 justify-between h-fit relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                
                <h3 className="font-bold text-white text-lg tracking-wide flex items-center gap-2">
                  {t.raceSummary}
                </h3>

                <div className="flex flex-col gap-3 text-sm bg-black/40 p-4 rounded-xl border border-indigo-950/50">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{t.selectedTextLabel}:</span>
                    <span className="font-semibold text-slate-200">{selectedSentence.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{t.textLengthLabel}:</span>
                    <span className="font-semibold text-slate-200 font-mono">{selectedSentence.text.length} {lang === 'mn' ? 'тэмдэгт' : 'chars'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{t.yourVehicleLabel}:</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      {selectedVehicle.emoji} {lang === 'mn' ? selectedVehicle.nameMn : selectedVehicle.nameEn}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{t.competitorLabel}:</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      {selectedCompetitor.emoji} {lang === 'mn' ? selectedCompetitor.nameMn : selectedCompetitor.nameEn}
                    </span>
                  </div>
                </div>

                <button
                  onClick={startRace}
                  className="w-full py-4 rounded-xl bg-white text-black font-bold tracking-wider text-base hover:bg-slate-100 transition-all shadow-xl shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  id="start-race-btn"
                >
                  <Play size={20} fill="currentColor" /> {t.startRace}
                </button>
              </div>

              {/* History Scoreboard */}
              <div className="rounded-2xl bg-[#121217]/80 border border-slate-800/80 p-6 backdrop-blur-xl flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white tracking-wide flex items-center gap-2">
                    <History size={18} className="text-indigo-400" /> {t.recentRaces}
                  </h3>
                  {history.length > 0 && (
                    <button 
                      onClick={clearHistory}
                      className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      id="clear-history-btn"
                    >
                      {t.clearHistory}
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-black/30 rounded-xl border border-slate-800/40">
                    <span className="text-2xl mb-2">🏁</span>
                    <p className="text-xs">{t.historyEmpty}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                    {history.map((h) => (
                      <div 
                        key={h.id} 
                        className="p-3 rounded-xl bg-black/40 border border-slate-800/50 flex items-center justify-between gap-3 text-xs hover:border-slate-700/60 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{h.vehicleEmoji}</span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-200 line-clamp-1">{h.sentenceTitle}</span>
                            <span className="text-[10px] text-slate-500">{h.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-indigo-400">{h.wpm} WPM</span>
                            <span className="text-[10px] text-slate-400 font-mono">{h.accuracy}% {lang === 'mn' ? 'зөв' : 'accuracy'}</span>
                          </div>
                          <span className="text-base">
                            {h.outcome === 'won' && '🏆'}
                            {h.outcome === 'lost' && '💀'}
                            {h.outcome === 'practice' && '🎯'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* COUNTDOWN OR PLAYING OR COMPLETED GAME STAGE */}
        {gameState !== 'setup' && (
          <div className="flex flex-col gap-6" id="game-stage">
            
            {/* Top Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="realtime-stats-grid">
              <div className="bg-[#121217]/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Flame size={20} className="animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{t.speedLabel}</span>
                  <span className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
                    {currentWpm} <span className="text-xs text-slate-500 font-sans font-normal">WPM</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#121217]/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{t.accuracyLabel}</span>
                  <span className="text-xl font-bold font-mono text-white">
                    {totalKeystrokes > 0 
                      ? Math.max(0, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100)) 
                      : 100}%
                  </span>
                </div>
              </div>

              <div className="bg-[#121217]/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                  <AlertCircle size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{t.errorsLabel}</span>
                  <span className="text-xl font-bold font-mono text-white">
                    {errorCount}
                  </span>
                </div>
              </div>

              <div className="bg-[#121217]/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Clock size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{t.timeLabel}</span>
                  <span className="text-xl font-bold font-mono text-white">
                    {startTime 
                      ? `${(( (endTime || Date.now()) - startTime ) / 1000).toFixed(1)} ${lang === 'mn' ? 'с' : 's'}` 
                      : `0.0 ${lang === 'mn' ? 'с' : 's'}`}
                  </span>
                </div>
              </div>
            </div>

            {/* RACE TRACK CONTAINER */}
            <div className="rounded-2xl bg-[#121217]/80 border border-slate-800/80 p-6 backdrop-blur-xl flex flex-col gap-6 relative shadow-2xl overflow-hidden shadow-black/40" id="race-track-container">
              {/* Track Decor */}
              <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-slate-800/50 dashed-border pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-16 w-8 bg-checkerboard opacity-10 pointer-events-none" />
              
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                <span className="text-xs font-semibold text-slate-400 tracking-wider flex items-center gap-1.5 uppercase">
                  🚦 {t.raceTrackTitle}
                </span>
                <span className="text-xs font-mono text-slate-500 bg-black/40 px-2.5 py-1 rounded-md border border-slate-800/80">
                  {lang === 'mn' ? 'Бариа' : 'Finish'}: {selectedSentence.text.length} {lang === 'mn' ? 'тэмдэгт' : 'chars'}
                </span>
              </div>

              {/* Lanes */}
              <div className="flex flex-col gap-6 relative py-4" id="lanes">
                
                {/* Lane 1: Player */}
                <div className="flex flex-col gap-2 relative">
                  <div className="flex justify-between text-xs font-semibold text-indigo-400 px-1">
                    <span>{lang === 'mn' ? 'Та' : 'You'} ({lang === 'mn' ? selectedVehicle.nameMn : selectedVehicle.nameEn})</span>
                    <span className="font-mono">{Math.round(playerProgress)}%</span>
                  </div>
                  
                  {/* Road */}
                  <div className="h-12 w-full bg-[#07070a] rounded-xl border border-slate-800/80 relative flex items-center shadow-inner overflow-hidden">
                    {/* Yellow dotted line divider */}
                    <div className="absolute left-0 right-0 h-[2px] border-t border-dashed border-slate-800/40 pointer-events-none" />Resource

                    {/* Finish Line with Glow */}
                    <div className="absolute right-12 top-0 bottom-0 w-[4px] bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] pointer-events-none" />
                    <span className="absolute right-4 text-sm" title="Барианы шугам">🏁</span>

                    {/* Vehicle */}
                    <motion.div 
                      className="absolute text-3xl z-10 select-none flex flex-col items-center justify-center cursor-default"
                      style={{ left: `calc(${playerProgress}% - 24px)`, marginLeft: playerProgress > 5 ? '12px' : '0px' }}
                      transition={{ type: 'spring', stiffness: 85, damping: 15 }}
                      layout
                    >
                      <span className="filter drop-shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-wiggle-subtle">
                        {selectedVehicle.emoji}
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Lane 2: Competitor (if selected) */}
                {selectedCompetitor.id !== 'none' && (
                  <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between text-xs font-semibold text-emerald-400 px-1">
                      <span>{lang === 'mn' ? selectedCompetitor.nameMn : selectedCompetitor.nameEn} {selectedCompetitor.emoji}</span>
                      <span className="font-mono">{Math.round(botProgress)}%</span>
                    </div>

                    {/* Road */}
                    <div className="h-12 w-full bg-[#07070a]/70 rounded-xl border border-slate-800/80 relative flex items-center shadow-inner overflow-hidden">
                      <div className="absolute left-0 right-0 h-[2px] border-t border-dashed border-slate-800/40 pointer-events-none" />
                      
                      {/* Finish Line */}
                      <div className="absolute right-12 top-0 bottom-0 w-[4px] bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] pointer-events-none" />
                      <span className="absolute right-4 text-sm">🏁</span>

                      {/* Bot Vehicle */}
                      <motion.div 
                        className="absolute text-3xl z-10 select-none flex flex-col items-center justify-center cursor-default"
                        style={{ left: `calc(${botProgress}% - 24px)`, marginLeft: botProgress > 5 ? '12px' : '0px' }}
                        transition={{ type: 'spring', stiffness: 50, damping: 12 }}
                        layout
                      >
                        <span className="filter drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]">
                          {selectedVehicle.id === 'horse' ? '🐎' :
                           selectedVehicle.id === 'car' ? '🚕' :
                           selectedVehicle.id === 'rocket' ? '🛸' : '🏎️'}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COUNTDOWN VIEW */}
            {gameState === 'countdown' && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-2xl bg-indigo-950/20 border border-indigo-500/20 p-12 text-center backdrop-blur-xl flex flex-col items-center justify-center gap-4 relative overflow-hidden shadow-2xl"
                id="countdown-container"
              >
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">{t.countdownPrefix}</span>
                <motion.span 
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 10 }}
                  className="text-8xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  {countdown}
                </motion.span>
                <p className="text-xs text-slate-500 mt-2">{t.countdownSubtitle}</p>
              </motion.div>
            )}

            {/* TYPING TEST WORKSPACE (PLAYING) */}
            {gameState === 'playing' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-5"
                id="typing-workspace"
              >
                {/* Text Display Panel */}
                <div 
                  onClick={focusInput}
                  className={`rounded-3xl border bg-[#121217]/50 backdrop-blur-xl p-8 md:p-10 cursor-text transition-all leading-relaxed relative overflow-hidden shadow-2xl shadow-black/35 ${
                    hasError 
                      ? 'border-rose-500/30 bg-rose-950/5 shadow-rose-500/5' 
                      : 'border-slate-800/80 hover:border-slate-700/80'
                  }`}
                  id="target-text-panel"
                >
                  {/* Neon Left accent line */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-150 ${hasError ? 'bg-rose-500' : 'bg-indigo-500'}`} />

                  <div className="flex justify-between items-center mb-6 border-b border-slate-800/40 pb-3 text-xs">
                    <span className="text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                      📖 {t.sourceTextLabel}: <span className="text-white capitalize font-sans ml-1">{selectedSentence.title}</span>
                    </span>
                    {hasError && (
                      <span className="text-rose-400 font-medium flex items-center gap-1 animate-pulse bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        <AlertCircle size={13} /> {t.fixErrorLabel}
                      </span>
                    )}
                  </div>

                  {/* Character highlight arena */}
                  <div className="select-none leading-relaxed py-2 max-h-[160px] overflow-y-auto font-medium" id="chars-wrapper">
                    {renderSentenceChars()}
                  </div>
                </div>

                {/* Input Text Box */}
                <div className="relative group" id="input-container">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${hasError ? 'from-rose-500 to-rose-600' : 'from-indigo-500 to-purple-600'} rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-300`} />
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder={t.placeholderText}
                    className={`w-full py-6 px-6 rounded-2xl bg-black border text-lg md:text-xl font-mono text-white transition-all outline-none relative z-10 ${
                      hasError 
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    }`}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    id="typing-input"
                  />
                  
                  {/* Cancel Run button inside the input area */}
                  <button
                    onClick={resetToSetup}
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs font-semibold flex items-center gap-1 z-20 cursor-pointer"
                    id="cancel-run-btn"
                  >
                    {t.backButton}
                  </button>
                </div>

                {/* User focus helper note */}
                <p className="text-center text-xs text-slate-600">
                  💡 {t.focusTip}
                </p>
              </motion.div>
            )}

            {/* COMPLETED RESULTS SCREEN */}
            {gameState === 'completed' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl bg-gradient-to-b from-[#14141d]/90 via-[#0d0d12]/95 to-[#08080a]/98 border border-slate-800/80 p-8 md:p-12 backdrop-blur-2xl relative overflow-hidden flex flex-col items-center justify-center gap-8 shadow-2xl text-center shadow-black/60"
                id="results-card"
              >
                {/* Decorative glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Victory badge or title */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-4xl shadow-xl shadow-indigo-500/10 animate-bounce-subtle">
                    🏆
                  </div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    {t.finishedTitle}
                  </h2>
                  <p className="text-slate-400 max-w-md text-sm leading-relaxed mt-1">
                    {t.finishedSubtitle}
                  </p>
                </div>

                {/* Outcome Statement */}
                {selectedCompetitor.id !== 'none' && (
                  <div className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide border flex items-center gap-2 ${
                    botProgress >= 100 
                      ? 'bg-rose-950/20 text-rose-400 border-rose-900/30' 
                      : 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30'
                  }`} id="race-outcome-banner">
                    {botProgress >= 100 ? (
                      <>
                        <span>💀 {lang === 'mn' ? `Өрсөлдөгч ${selectedCompetitor.nameMn} түрүүллээ!` : `Competitor ${selectedCompetitor.nameEn} won the race!`}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>🏆 {lang === 'mn' ? `Баяр хүргэе! Та ${selectedCompetitor.nameMn}-г яллаа!` : `Congratulations! You beat ${selectedCompetitor.nameEn}!`}</span>
                      </>
                    )}
                  </div>
                )}

                {/* Score breakdown metrics dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl bg-black/60 p-6 rounded-2xl border border-slate-800/50" id="results-stats-panel">
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{t.statsWpm}</span>
                    <span className="text-4xl font-black font-mono text-white">{finalWpm}</span>
                    <span className="text-[10px] text-slate-500 font-mono">WPM</span>
                  </div>

                  <div className="flex flex-col gap-1 items-center justify-center border-l border-slate-800/60">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{t.statsAccuracy}</span>
                    <span className="text-4xl font-black font-mono text-emerald-400">{finalAccuracy}%</span>
                    <span className="text-[10px] text-slate-500">{t.correctHits}</span>
                  </div>

                  <div className="flex flex-col gap-1 items-center justify-center border-l border-slate-800/60">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{t.statsTime}</span>
                    <span className="text-4xl font-black font-mono text-white">{finalTimeSeconds.toFixed(1)} {lang === 'mn' ? 'с' : 's'}</span>
                    <span className="text-[10px] text-slate-500">{t.secondsUnit}</span>
                  </div>

                  <div className="flex flex-col gap-1 items-center justify-center border-l border-slate-800/60">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{t.statsErrors}</span>
                    <span className="text-4xl font-black font-mono text-rose-400">{errorCount}</span>
                    <span className="text-[10px] text-slate-500">{t.timesUnit}</span>
                  </div>
                </div>

                {/* Level review badge */}
                <div className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-5 py-2.5 rounded-xl" id="review-badge">
                  {t.levelBadge}: <span className="font-bold text-white uppercase ml-1">
                    {finalWpm >= 80 ? t.legendarySpeed :
                     finalWpm >= 55 ? t.majesticSpeed :
                     finalWpm >= 35 ? t.expertSpeed : t.rookieSpeed}
                  </span>
                </div>

                {/* Control Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                  <button
                    onClick={startRace}
                    className="flex-1 py-4 px-6 rounded-xl bg-white text-black font-bold tracking-wider hover:bg-slate-100 transition-all shadow-xl shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    id="retry-race-btn"
                  >
                    <RotateCcw size={18} /> {t.retryBtn}
                  </button>

                  <button
                    onClick={resetToSetup}
                    className="flex-1 py-4 px-6 rounded-xl bg-[#121217] hover:bg-[#1c1c24] border border-slate-800 text-white font-bold tracking-wider transition-all active:scale-[0.98] cursor-pointer"
                    id="return-setup-btn"
                  >
                    {t.changeSettingsBtn}
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        )}
      </main>

      {/* HELP INSTRUCTIONS MODAL */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="help-modal">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-[#0e0e12] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl z-10 text-slate-200 shadow-black/80"
            >
              <button
                onClick={() => setShowHelp(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#121217] hover:bg-[#1a1a24] text-slate-400 hover:text-white transition-colors cursor-pointer"
                id="close-help-btn"
              >
                <X size={16} />
              </button>

              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 tracking-wide font-display">
                {t.helpTitle}
              </h3>

              <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-300">
                <div className="flex gap-3">
                  <span className="text-lg">1️⃣</span>
                  <p>
                    {t.instruction1}
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg">2️⃣</span>
                  <p>
                    {t.instruction2}
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg">3️⃣</span>
                  <p>
                    {t.instruction3}
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg">4️⃣</span>
                  <p>
                    {t.instruction4}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm transition-all hover:bg-slate-100 cursor-pointer"
                id="ack-help-btn"
              >
                {t.closeBtn}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Humble credit footer */}
      <footer className="py-5 border-t border-slate-900 bg-[#07070a] text-center text-[10px] text-slate-600 relative z-10" id="footer">
        {t.footerText}
      </footer>
    </div>
  );
}
