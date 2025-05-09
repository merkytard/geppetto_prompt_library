
    import { useState, useCallback } from 'react';
    import usePersistentState from './usePersistentState';
    import { useToast } from "@/components/ui/use-toast";
    import { Award, CheckCircle, Zap } from 'lucide-react';

    const initialLeaderboardData = [
        { id: 1, name: 'Alex', xp: 1500, level: 5 },
        { id: 2, name: 'Sam', xp: 1250, level: 4 },
        { id: 3, name: 'Jamie', xp: 980, level: 3 },
        { id: 4, name: 'Taylor', xp: 700, level: 3 },
        { id: 5, name: 'Chris', xp: 500, level: 2 },
    ];

    const initialTamagotchiState = {
        hasChosen: false,
        type: null,
        name: null,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
    };
    
    const initialProjectSpiritState = {}; 

    const useGamification = () => {
        const [tamagotchiState, setTamagotchiState] = usePersistentState('tamagotchiState_v2', initialTamagotchiState);
        const [leaderboardData, setLeaderboardData] = usePersistentState('leaderboardData_v2', initialLeaderboardData);
        const [projectSpirits, setProjectSpirits] = usePersistentState('projectSpirits_v1', initialProjectSpiritState);
        const { toast } = useToast();

        const handleChooseEgg = useCallback((type, name) => {
            setTamagotchiState(prev => ({
                ...prev,
                hasChosen: true,
                type: type,
                name: name,
                level: 1,
                xp: 0,
                xpToNextLevel: 100,
            }));
            setLeaderboardData(prev => {
                if (!prev.some(user => user.name === name)) {
                    return [...prev, { id: Date.now(), name: name, xp: 0, level: 1 }].sort((a, b) => b.xp - a.xp);
                }
                return prev;
            });
            toast({ title: "Avatar Chosen!", description: `Welcome, ${name} the ${type}!` });
        }, [setTamagotchiState, setLeaderboardData, toast]);

        const awardXP = useCallback((xpAmount, taskTitle, projectId = null) => {
            let levelUpOccurred = false;
            let newLevelReached = 0;

            if (tamagotchiState && tamagotchiState.hasChosen) {
                setTamagotchiState(prev => {
                    const newXp = (prev.xp || 0) + xpAmount;
                    let currentLevel = prev.level || 1;
                    let xpForNext = prev.xpToNextLevel || 100;
                    let xpOverflow = 0;

                    if (newXp >= xpForNext) {
                        levelUpOccurred = true;
                        currentLevel += 1;
                        newLevelReached = currentLevel;
                        xpOverflow = newXp - xpForNext;
                        xpForNext = Math.floor(xpForNext * 1.5); 
                    }

                    return {
                        ...prev,
                        xp: xpOverflow > 0 ? xpOverflow : newXp,
                        level: currentLevel,
                        xpToNextLevel: xpForNext,
                    };
                });

                setLeaderboardData(prev => {
                    return prev.map(user => {
                        if (user.name === tamagotchiState.name) {
                            const updatedXp = (user.xp || 0) + xpAmount;
                            const updatedLevel = levelUpOccurred ? newLevelReached : user.level;
                            return { ...user, xp: updatedXp, level: updatedLevel };
                        }
                        return user;
                    }).sort((a, b) => b.xp - a.xp);
                });

                if (levelUpOccurred) {
                    toast({
                        title: "Level Up!",
                        description: `${tamagotchiState.name} reached Level ${newLevelReached}!`,
                        action: <Award className="h-5 w-5 text-yellow-400" />,
                    });
                }
                toast({
                    title: "Task Completed!",
                    description: `You earned ${xpAmount} XP for completing "${taskTitle}".`,
                    action: <CheckCircle className="h-5 w-5 text-green-500" />,
                });
            } else {
                 toast({
                    title: "XP Awarded!",
                    description: `${xpAmount} XP for completing "${taskTitle}". Choose an avatar to see progress!`,
                    action: <Zap className="h-5 w-5 text-blue-500" />,
                });
            }

            if (projectId) {
                setProjectSpirits(prev => {
                    const currentSpirit = prev[projectId] || { xp: 0, level: 1, xpToNextLevel: 500 };
                    const newSpiritXp = currentSpirit.xp + xpAmount;
                    let spiritLevel = currentSpirit.level;
                    let spiritXpToNext = currentSpirit.xpToNextLevel;
                    let spiritXpOverflow = 0;

                    if (newSpiritXp >= spiritXpToNext) {
                        spiritLevel +=1;
                        spiritXpOverflow = newSpiritXp - spiritXpToNext;
                        spiritXpToNext = Math.floor(spiritXpToNext * 1.8);
                        toast({ title: "Project Spirit Leveled Up!", description: `Project ID ${projectId} spirit reached level ${spiritLevel}!`, action: <Award className="h-5 w-5 text-purple-400" /> });
                    }
                    return {
                        ...prev,
                        [projectId]: {
                            xp: spiritXpOverflow > 0 ? spiritXpOverflow : newSpiritXp,
                            level: spiritLevel,
                            xpToNextLevel: spiritXpToNext,
                        }
                    };
                });
            }

        }, [setTamagotchiState, setLeaderboardData, tamagotchiState, setProjectSpirits, toast]);
        
        const getProjectSpirit = useCallback((projectId) => {
            return projectSpirits[projectId] || { name: "Project Spirit", type: "octopus", xp: 0, level: 1, xpToNextLevel: 500, hasChosen: true }; // Default spirit
        }, [projectSpirits]);

        return {
            tamagotchiState,
            setTamagotchiState,
            leaderboardData,
            projectSpirits,
            getProjectSpirit,
            handleChooseEgg,
            awardXP,
        };
    };

    export default useGamification;
  