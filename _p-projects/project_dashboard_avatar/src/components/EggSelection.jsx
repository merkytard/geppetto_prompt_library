
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Egg, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define eggs with potential avatar types
const eggsData = [
  { id: 'egg1', type: ['chameleon', 'painter'], color: 'bg-gradient-to-br from-green-300 to-blue-300', hoverColor: 'hover:shadow-[0_0_20px_rgba(50,200,100,0.7)]' },
  { id: 'egg2', type: ['owl', 'analyst'], color: 'bg-gradient-to-br from-purple-300 to-indigo-300', hoverColor: 'hover:shadow-[0_0_20px_rgba(100,100,250,0.7)]' },
  { id: 'egg3', type: ['beaver', 'marketer'], color: 'bg-gradient-to-br from-yellow-300 to-orange-300', hoverColor: 'hover:shadow-[0_0_20px_rgba(250,150,50,0.7)]' },
];

// Get a random type from the egg's possibilities
const getRandomTypeFromEgg = (eggId) => {
   const egg = eggsData.find(e => e.id === eggId);
   if (!egg) return null;
   const randomIndex = Math.floor(Math.random() * egg.type.length);
   return egg.type[randomIndex];
};


const EggComponent = ({ egg, onClick, clickCount = 0 }) => {
   const cracks = [
      // Define crack paths or images as needed for animation
      { path: "M 10 20 Q 15 15 20 20 T 30 20", opacity: clickCount >= 1 ? 1 : 0 },
      { path: "M 30 30 Q 35 35 40 30 T 50 30", opacity: clickCount >= 2 ? 1 : 0 },
      { path: "M 20 40 Q 25 45 30 40 T 40 40", opacity: clickCount >= 3 ? 1 : 0 },
   ];

   return (
       <motion.div
           className={cn("relative w-24 h-32 rounded-[50%/60%] cursor-pointer transition-shadow duration-300", egg.color, egg.hoverColor)}
           onClick={() => onClick(egg.id)}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
       >
           {/* Placeholder for crack effect */}
           <svg viewBox="0 0 50 60" className="absolute inset-0 w-full h-full opacity-70">
               {cracks.map((crack, index) => (
                   <motion.path
                       key={index}
                       d={crack.path}
                       fill="none"
                       stroke="rgba(0,0,0,0.5)"
                       strokeWidth="1"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: crack.opacity }}
                       transition={{ duration: 0.2 }}
                   />
               ))}
           </svg>
            {clickCount >= 3 && (
               <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3}}
               >
                  <Check className="w-10 h-10 text-white" />
               </motion.div>
            )}
       </motion.div>
   );
};

const EggSelection = ({ onHatch }) => {
  const [selectedEggId, setSelectedEggId] = useState(null);
  const [clickCounts, setClickCounts] = useState({}); // { eggId: count }
  const [isHatching, setIsHatching] = useState(false);

  const handleEggClick = (eggId) => {
     if (isHatching) return;

     const currentClicks = clickCounts[eggId] || 0;
     if (currentClicks < 3) {
        const newClicks = currentClicks + 1;
        setClickCounts(prev => ({ ...prev, [eggId]: newClicks }));
        setSelectedEggId(eggId); // Select the egg being clicked

        if (newClicks === 3) {
            setIsHatching(true);
            const hatchedType = getRandomTypeFromEgg(eggId);
            // Delay hatching to show the checkmark/final crack
            setTimeout(() => {
                onHatch(hatchedType);
            }, 1000); // Adjust delay as needed
        }
     }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 bg-card rounded-lg shadow-lg">
       <motion.h2
         className="text-2xl font-bold text-primary"
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
       >
          Choose Your Companion Egg!
       </motion.h2>
       <p className="text-muted-foreground text-center">Tap an egg three times to hatch it.</p>
      <motion.div
         className="flex gap-10"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.2, staggerChildren: 0.1 }}
      >
        {eggsData.map((egg) => (
          <motion.div key={egg.id} initial={{ y: 20 }} animate={{ y: 0 }}>
             <EggComponent
                egg={egg}
                onClick={handleEggClick}
                clickCount={clickCounts[egg.id] || 0}
             />
          </motion.div>
        ))}
      </motion.div>
       <AnimatePresence>
       {isHatching && (
          <motion.div
             className="mt-4 text-lg font-semibold text-green-600"
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
          >
             Hatching...
          </motion.div>
       )}
       </AnimatePresence>
    </div>
  );
};

export default EggSelection;
