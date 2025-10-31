import { Fingerprint, Heart, Home, Rocket, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import './styles/globals.css';

const categories = [
  {
    key: 'friendship',
    label: 'Friendship',
    icon: Sparkles,
    color: '#FFD54F',
    bgColor: '#FFFBEA',
    emoji: '✨',
    illustration: '🤝',
    tagline: 'Connect deeper',
    description: 'Explore the foundations of meaningful friendships.',
    questions: [
      { text: 'What makes a friendship last?', reason: 'Understanding the foundations of lasting relationships helps us nurture deeper connections.' },
      { text: 'How do you define trust?', reason: 'Trust is the cornerstone of any meaningful friendship and exploring its meaning reveals our values.' },
      { text: 'What\'s the friendship you still replay in your head — not out of regret, but curiosity?', reason: 'The ones that haunt us tend to hold a lesson we half-learned, still waiting to land.' },
    ],
  },
  {
    key: 'love',
    label: 'Love & Relationships',
    icon: Heart,
    color: '#FF6B6B',
    bgColor: '#FFF0F0',
    emoji: '💕',
    illustration: '💝',
    tagline: 'Understand intimacy',
    description: 'Navigate the complexities of love and connection.',
    questions: [
      { text: 'What does love mean to you?', reason: 'Love is one of the most profound human experiences, and defining it helps us understand ourselves better.' },
      { text: 'How do you handle conflicts in relationships?', reason: 'Conflict resolution skills are essential for healthy relationships and personal growth.' },
      { text: 'What part of your desire feels hardest to admit, even to yourself?', reason: 'The edges of desire usually touch shame. Naming it can separate what\'s truly yours from what\'s been taught to you.' },
      { text: 'How do you behave when love starts feeling ordinary?', reason: 'That moment tests whether you\'re chasing novelty or learning to see depth — the difference between spark and flame.' },
    ],
  },
  {
    key: 'identity',
    label: 'Identity & Life',
    icon: Fingerprint,
    color: '#3b82f6',
    bgColor: '#DBEAFE',
    emoji: '🌟',
    illustration: '🎭',
    tagline: 'Discover yourself',
    description: 'Journey into who you are and who you\'re becoming.',
    questions: [
      { text: 'Who are you when no one is watching?', reason: 'Our authentic self emerges in solitude, revealing our true character and values.' },
      { text: 'What shaped your identity the most?', reason: 'Understanding our formative experiences helps us make sense of who we are today.' },
      { text: 'Where in your life do you keep starting over without resentment?', reason: 'Those restarts are clues to what\'s genuinely alive for you — persistence rooted in curiosity, not duty.' },
      { text: 'If your life had seasons, which one are you in now — and what are you refusing to let thaw or fall away?', reason: 'Thinking in seasons softens judgment. It reminds you that endings and renewals often happen at once.' },
    ],
  },
  {
    key: 'goals',
    label: 'Goals & Society',
    icon: Rocket,
    color: '#FFA726',
    bgColor: '#FFF8E8',
    emoji: '🚀',
    illustration: '🎯',
    tagline: 'Build your future',
    description: 'Define success on your own terms.',
    questions: [
      { text: 'What is your biggest goal?', reason: 'Clarifying our goals gives us direction and purpose in life.' },
      { text: 'How do you define success?', reason: 'Understanding what success means to us helps align our actions with our values.' },
      { text: 'What would change if your ambition was measured by depth, not scale?', reason: 'Society rewards visibility, not integrity. This shift in metric can reveal a quieter, truer kind of legacy.' },
    ],
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[0] | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = { light: 10, medium: 20, heavy: 50 };
      navigator.vibrate(patterns[intensity]);
    }
  };

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark
    ? {
        background: '#1A1A1A',
        text: '#FFFFFF',
        subtext: '#999999',
        card: '#2A2A2A',
      }
    : {
        background: '#F5F5F5',
        text: '#1A1A1A',
        subtext: '#666666',
        card: '#FFFFFF',
      };

  const handleCategorySelect = (cat: typeof categories[0]) => {
    setSelectedCategory(cat);
    setQuestionIndex(0);
    setIsFlipped(false);
    triggerHaptic('medium');
  };

  const handleBackToHome = () => {
    setSelectedCategory(null);
    setQuestionIndex(0);
    setIsFlipped(false);
    triggerHaptic('medium');
  };

  const scrollToCategories = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleQuestionScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!selectedCategory) return;
    const scrollTop = e.currentTarget.scrollTop;
    const windowHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / windowHeight);
    if (newIndex !== questionIndex && newIndex >= 0 && newIndex < selectedCategory.questions.length) {
      setQuestionIndex(newIndex);
      setIsFlipped(false);
      triggerHaptic('light');
    }
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center gap-4">
          {selectedCategory && (
            <button
              onClick={handleBackToHome}
              className="p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300"
              style={{
                backgroundColor: theme.card,
                boxShadow: isDark
                  ? '0 4px 20px rgba(0,0,0,0.5)'
                  : '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <Home size={20} color={theme.text} strokeWidth={2.5} />
            </button>
          )}
          
          <h1 
            className="text-3xl md:text-4xl tracking-tight"
            style={{ 
              background: 'linear-gradient(135deg, #6D28D9 0%, #D91B7A 25%, #E6B800 50%, #DC2B85 75%, #6D28D9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%',
              animation: 'gradient 8s ease infinite'
            }}
          >
            Cogito
          </h1>
        </div>
        
        <button 
          onClick={toggleTheme} 
          className="text-2xl p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          style={{
            backgroundColor: theme.card,
            boxShadow: isDark
              ? '0 4px 20px rgba(0,0,0,0.5)'
              : '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          /* Landing Page + Categories Carousel */
          <motion.div
            key="home-carousel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            ref={scrollContainerRef}
            className="h-screen overflow-y-auto snap-y snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Landing Page */}
            <div 
              className="h-screen flex items-center justify-center snap-start snap-always px-6"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff'
              }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, type: 'spring' }}
                >
                  <h2 
                    className="text-5xl md:text-6xl mb-6"
                    style={{ color: theme.text }}
                  >
                    Welcome to
                  </h2>
                  <h1 
                    className="text-7xl md:text-8xl"
                    style={{ 
                      background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 25%, #FFD54F 50%, #F472B6 75%, #A855F7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      paddingBottom: '0.15em',
                      lineHeight: '1.2'
                    }}
                  >
                    Cogito
                  </h1>
                </motion.div>
              </div>
            </div>

            {/* Categories */}
            {categories.map((cat, idx) => (
              <div 
                key={cat.key}
                className="h-screen flex items-center justify-center snap-start snap-always px-6"
                style={{
                  background: cat.key === 'identity' 
                    ? (isDark
                      ? 'radial-gradient(circle at 20% 30%, #6D28D940 0%, transparent 30%), radial-gradient(circle at 80% 20%, #6D28D925 0%, transparent 30%), radial-gradient(circle at 40% 70%, #6D28D930 0%, transparent 30%), radial-gradient(circle at 75% 80%, #6D28D920 0%, transparent 30%), #0a0a0a'
                      : '#6D28D9')
                    : (isDark
                      ? `radial-gradient(circle at 20% 30%, ${cat.color}40 0%, transparent 30%), radial-gradient(circle at 80% 20%, ${cat.color}25 0%, transparent 30%), radial-gradient(circle at 40% 70%, ${cat.color}30 0%, transparent 30%), radial-gradient(circle at 75% 80%, ${cat.color}20 0%, transparent 30%), #0a0a0a`
                      : cat.color)
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: false, amount: 0.8 }}
                  className="w-full max-w-md rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden"
                  style={{
                    backgroundColor: isDark ? theme.card : cat.bgColor,
                    minHeight: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Illustration */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      viewport={{ once: false }}
                      className="text-8xl mb-6"
                    >
                      {cat.illustration}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h2 
                      className="text-4xl md:text-5xl mb-4 leading-tight"
                      style={{ color: cat.key === 'identity' ? '#6D28D9' : cat.color }}
                    >
                      {cat.label}
                    </h2>
                    
                    <p 
                      className="text-lg mb-2"
                      style={{ 
                        color: cat.key === 'identity' ? '#6D28D9' : cat.color,
                        opacity: 0.9
                      }}
                    >
                      {cat.tagline}
                    </p>
                    
                    <p 
                      className="text-base mb-8"
                      style={{ color: theme.subtext }}
                    >
                      {cat.description}
                    </p>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleCategorySelect(cat)}
                      className="w-full py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                      style={{
                        backgroundColor: cat.key === 'identity' ? '#6D28D9' : cat.color,
                        color: '#FFFFFF',
                      }}
                    >
                      <span className="text-lg">
                        Start exploring →
                      </span>
                    </button>
                  </div>

                  {/* Category Counter */}

                </motion.div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* Questions Carousel */
          <motion.div
            key="questions-carousel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-screen overflow-y-auto snap-y snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
            onScroll={handleQuestionScroll}
          >
            {selectedCategory.questions.map((q, index) => (
              <div 
                key={index}
                className="h-screen flex items-center justify-center snap-start snap-always px-6"
                style={{ 
                  background: isDark 
                    ? (selectedCategory.key === 'identity'
                      ? 'radial-gradient(circle at 20% 30%, #6D28D940 0%, transparent 30%), radial-gradient(circle at 80% 20%, #6D28D925 0%, transparent 30%), radial-gradient(circle at 40% 70%, #6D28D930 0%, transparent 30%), radial-gradient(circle at 75% 80%, #6D28D920 0%, transparent 30%), #0a0a0a'
                      : `radial-gradient(circle at 20% 30%, ${selectedCategory.color}40 0%, transparent 30%), radial-gradient(circle at 80% 20%, ${selectedCategory.color}25 0%, transparent 30%), radial-gradient(circle at 40% 70%, ${selectedCategory.color}30 0%, transparent 30%), radial-gradient(circle at 75% 80%, ${selectedCategory.color}20 0%, transparent 30%), #0a0a0a`)
                    : (selectedCategory.key === 'identity' ? '#6D28D9' : selectedCategory.color) 
                }}
              >
                <div className="w-full max-w-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false, amount: 0.8 }}
                    className="rounded-[2.5rem] shadow-2xl overflow-hidden"
                    style={{
                      backgroundColor: selectedCategory.bgColor,
                      minHeight: '500px',
                    }}
                  >
                    {/* Card Content */}
                    <div 
                      className="p-10 md:p-12 cursor-pointer"
                      onClick={() => {
                        if (index === questionIndex) {
                          setIsFlipped(!isFlipped);
                          triggerHaptic('medium');
                        }
                      }}
                      style={{ minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                      <AnimatePresence mode="wait">
                        {!isFlipped || index !== questionIndex ? (
                          <motion.div
                            key="question"
                            initial={{ opacity: 0, rotateY: -90 }}
                            animate={{ opacity: 1, rotateY: 0 }}
                            exit={{ opacity: 0, rotateY: 90 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col"
                          >
                            <div className="flex-1 flex flex-col justify-center">
                              {/* Icon */}
                              <div className="mb-8">
                                <div 
                                  className="inline-block p-4 rounded-2xl"
                                  style={{ 
                                    backgroundColor: selectedCategory.key === 'identity' 
                                      ? '#6D28D930' 
                                      : `${selectedCategory.color}30` 
                                  }}
                                >
                                  <selectedCategory.icon 
                                    size={32} 
                                    color={selectedCategory.key === 'identity' ? '#6D28D9' : selectedCategory.color} 
                                    strokeWidth={2}
                                  />
                                </div>
                              </div>

                              {/* Question */}
                              <h3 
                                className="text-3xl md:text-4xl leading-snug mb-6"
                                style={{ 
                                  color: selectedCategory.key === 'identity' 
                                    ? '#6D28D9' 
                                    : selectedCategory.color 
                                }}
                              >
                                {q.text}
                              </h3>
                            </div>

                            {/* Hint */}
                            {index === questionIndex && (
                              <div className="flex items-center gap-2">
                                <motion.span
                                  animate={{ rotate: [0, 180, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                  style={{ fontSize: '1.25rem' }}
                                >
                                  🔄
                                </motion.span>
                                <span style={{ color: theme.subtext, fontSize: '0.9rem' }}>
                                  Tap to see why this matters
                                </span>
                              </div>
                            )}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="reason"
                            initial={{ opacity: 0, rotateY: -90 }}
                            animate={{ opacity: 1, rotateY: 0 }}
                            exit={{ opacity: 0, rotateY: 90 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col justify-center"
                          >
                            {/* Icon */}
                            <div className="mb-8">
                              <div 
                                className="inline-block p-4 rounded-2xl"
                                style={{ 
                                  backgroundColor: selectedCategory.key === 'identity' 
                                    ? '#6D28D930' 
                                    : `${selectedCategory.color}30` 
                                }}
                              >
                                <selectedCategory.icon 
                                  size={32} 
                                  color={selectedCategory.key === 'identity' ? '#6D28D9' : selectedCategory.color} 
                                  strokeWidth={2}
                                />
                              </div>
                            </div>

                            {/* Reason */}
                            <p 
                              className="text-xl md:text-2xl leading-relaxed"
                              style={{ 
                                color: selectedCategory.key === 'identity' 
                                  ? '#6D28D9' 
                                  : selectedCategory.color 
                              }}
                            >
                              {q.reason}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Progress Counter */}
                  {index === questionIndex && (
                    <motion.div 
                      className="mt-6 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >

                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}