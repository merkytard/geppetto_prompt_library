
    import React, { useState, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { cn } from '@/lib/utils';
    import { MessageSquare, Zap } from 'lucide-react';

    const avatarTypes = {
      chameleon: { name: 'Chameleon', icon: '🦎', description: 'Creative Visionary', color: 'text-green-500' },
      owl: { name: 'Owl', icon: '🦉', description: 'Strategic Planner', color: 'text-indigo-500' },
      beaver: { name: 'Beaver', icon: '🐿️', description: 'Diligent Builder', color: 'text-amber-600' },
      peacock: { name: 'Peacock', icon: '🦚', description: 'Engaging Promoter', color: 'text-cyan-500' },
      octopus: { name: 'Octopus', icon: '🐙', description: 'Versatile Creator', color: 'text-rose-500' },
    };

    const wellnessTips = [
        "Time for a quick stretch!", "Hydrate! Drink some water.", "Look away from the screen for 20s.",
        "How about a short walk?", "Deep breaths: inhale, exhale.", "Good job focusing! Keep it up.",
        "Teamwork makes the dream work!", "Ask a colleague how they're doing.", "Share a positive thought!",
        "Remember your goals!", "Small steps lead to big wins!", "Stay curious!", "Celebrate a small victory!"
    ];

    const TamagotchiAvatar = ({ state, onInteract, size = 'default' }) => {
      const { type = 'chameleon', name = 'Buddy', level = 1, xp = 0, xpToNextLevel = 100 } = state || {};
      const avatarDetails = avatarTypes[type] || avatarTypes.chameleon;
      const [showBubble, setShowBubble] = useState(false);
      const [bubbleMessage, setBubbleMessage] = useState('');
      const [isLevelUp, setIsLevelUp] = useState(false);
      const [prevLevel, setPrevLevel] = useState(level);

      const sizeClasses = {
        default: { container: 'w-48 h-48', icon: 'text-6xl', text: 'text-xs', level: 'text-sm', xp: 'text-xs', bubble: 'max-w-[120px] text-xs -top-12 -right-10', levelUpIcon: 'h-10 w-10' },
        large: { container: 'w-80 h-80', icon: 'text-9xl', text: 'text-base', level: 'text-lg', xp: 'text-sm', bubble: 'max-w-[180px] text-sm -top-20 -right-16', levelUpIcon: 'h-16 w-16' },
      };
      const currentSize = sizeClasses[size] || sizeClasses.default;

      useEffect(() => {
        if (level > prevLevel) {
            setIsLevelUp(true);
            setPrevLevel(level);
            setTimeout(() => setIsLevelUp(false), 3000); 
        }
      }, [level, prevLevel]);
      

      useEffect(() => {
        let bubbleTimer;
        let messageTimer;

        const displayRandomTip = () => {
            setBubbleMessage(wellnessTips[Math.floor(Math.random() * wellnessTips.length)]);
            setShowBubble(true);
            messageTimer = setTimeout(() => setShowBubble(false), 7000); 
        };
        
        if (state && state.hasChosen && !isLevelUp) { // Don't show tips during level up
            bubbleTimer = setInterval(displayRandomTip, 35000); // Show tip every 35 seconds
        }
        
        return () => {
            clearInterval(bubbleTimer);
            clearTimeout(messageTimer);
        };
      }, [state, isLevelUp]);


      const idleVariants = {
        initial: { y: 0, rotate: 0 },
        animate: {
          y: [0, -3, 0, 3, 0],
          rotate: [0, 1.5, -1.5, 1.5, 0],
          transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        }
      };

      const interactVariants = {
        hover: { scale: 1.05, boxShadow: "0px 0px 20px hsl(var(--primary) / 0.3)"},
        tap: { scale: 0.95, rotate: [0, 5, -5, 5, 0], transition: { duration: 0.4 } }
      };

      const bubbleVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.8 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
      };

      const levelUpSparkleVariants = {
        initial: { opacity: 0, scale: 0.5, y: 20 },
        animate: (i) => ({
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            y: [20, -20, -40],
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: "easeOut"
            }
        }),
      };

      return (
        <motion.div
          className={cn(
            "relative flex flex-col items-center justify-center p-4 rounded-full bg-gradient-to-br from-background to-muted/50 border-4 border-primary/30 shadow-xl cursor-pointer",
            currentSize.container
          )}
          whileHover="hover"
          whileTap="tap"
          variants={interactVariants}
          onClick={onInteract}
        >
          <AnimatePresence>
            {showBubble && bubbleMessage && (
              <motion.div
                key="bubble"
                variants={bubbleVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={cn(
                  "absolute p-2 bg-primary text-primary-foreground rounded-lg shadow-md z-10",
                  currentSize.bubble
                )}
              >
                <MessageSquare className="absolute -bottom-2 left-3 h-4 w-4 text-primary transform rotate-45" fill="hsl(var(--primary))" />
                {bubbleMessage}
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {isLevelUp && (
                <motion.div
                    key="level-up-indicator"
                    className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5 } }}
                    exit={{ opacity: 0, transition: { duration: 1.5 } }}
                >
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={`sparkle-${i}`}
                            custom={i}
                            variants={levelUpSparkleVariants}
                            initial="initial"
                            animate="animate"
                            className="absolute"
                        >
                            <Zap className={cn("text-yellow-400", currentSize.levelUpIcon)} fill="currentColor" />
                        </motion.div>
                    ))}
                   <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { delay: 0.2, type: 'spring', stiffness: 200, damping: 10 } }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute text-2xl font-bold text-yellow-300 drop-shadow-lg"
                    >
                        LVL UP!
                    </motion.div>
                </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={type} 
            variants={idleVariants}
            initial="initial"
            animate="animate"
            className="mb-2"
          >
            <motion.span
              className={cn("block", currentSize.icon, isLevelUp ? 'animate-pulse' : '')}
            >
              {avatarDetails.icon}
            </motion.span>
          </motion.div>

          <p className={cn("font-bold", currentSize.text)}>{name}</p>
          <p className={cn("text-muted-foreground", currentSize.text)}>{avatarDetails.description}</p>
          <p className={cn("mt-1 font-semibold", currentSize.level, avatarDetails.color)}>Level {level}</p>
          <div className={cn("w-3/4 h-1.5 bg-muted rounded-full overflow-hidden mt-1", currentSize.xp)}>
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${(xp / xpToNextLevel) * 100}%` }}
              transition={{ duration: 0.7, ease: "circOut" }}
            />
          </div>
          <p className={cn("text-muted-foreground mt-0.5", currentSize.xp)}>XP: {xp} / {xpToNextLevel}</p>
        </motion.div>
      );
    };

    export default TamagotchiAvatar;
  