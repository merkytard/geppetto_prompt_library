
      import React, { useState, useRef, useEffect } from 'react';
      import { motion, AnimatePresence } from 'framer-motion';
      import { Bot, X, Send, Cpu } from 'lucide-react'; // Added Cpu icon
      import { Button } from '@/components/ui/button';
      import { Input } from '@/components/ui/input';
      import { ScrollArea } from '@/components/ui/scroll-area';
      import { cn } from '@/lib/utils';

      const AiChatWidget = () => {
          const [isOpen, setIsOpen] = useState(false);
          const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! ChatGPT & Deepseek ready to assist.', aiSource: 'System' }]);
          const [inputValue, setInputValue] = useState('');
          const [nextAi, setNextAi] = useState('ChatGPT'); // Alternate AI responses
          const scrollAreaRef = useRef(null);

          const toggleChat = () => setIsOpen(!isOpen);

          const handleSend = (e) => {
              e.preventDefault();
              const text = inputValue.trim();
              if (!text) return;

              setMessages(prev => [...prev, { sender: 'user', text }]);
              setInputValue('');

              // Mock AI response - alternating
              const currentAi = nextAi;
              setNextAi(prev => prev === 'ChatGPT' ? 'Deepseek' : 'ChatGPT'); // Toggle for next response

              setTimeout(() => {
                   setMessages(prev => [...prev, {
                       sender: 'ai',
                       text: `Thinking about "${text}"... (Mock response from ${currentAi})`,
                       aiSource: currentAi // Store which AI "responded"
                   }]);
              }, 1000 + Math.random() * 500); // Add slight random delay
          };

          // Scroll to bottom when new messages are added
           useEffect(() => {
               if (scrollAreaRef.current) {
                   // Attempt to find the viewport element more reliably
                   const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') || scrollAreaRef.current;
                   if (scrollElement) {
                       scrollElement.scrollTop = scrollElement.scrollHeight;
                   }
               }
           }, [messages]);


          return (
              <>
                  {/* Floating Button */}
                  <motion.div
                      className="fixed bottom-6 right-6 z-50"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                  >
                      <Button
                          size="icon"
                          className="rounded-full h-14 w-14 gold-button shadow-lg"
                          onClick={toggleChat}
                      >
                          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                          <span className="sr-only">Toggle AI Chat</span>
                      </Button>
                  </motion.div>

                  {/* Chat Window */}
                  <AnimatePresence>
                      {isOpen && (
                          <motion.div
                              className="fixed bottom-24 right-6 z-50 w-80 h-[450px] bg-card border rounded-lg shadow-xl flex flex-col overflow-hidden"
                              initial={{ opacity: 0, y: 20, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 20, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                          >
                              <header className="p-3 border-b bg-secondary/50 flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                     <Bot className="h-5 w-5 text-primary" />
                                     <h3 className="font-semibold text-sm">AI Assistant</h3>
                                  </div>
                                  <span className="text-xs text-muted-foreground">ChatGPT / Deepseek</span>
                              </header>

                              {/* Ensure ScrollArea takes full height */}
                              <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
                                  <div className="space-y-3">
                                      {messages.map((msg, index) => (
                                          <div
                                              key={index}
                                              className={cn(
                                                  "flex flex-col", // Use flex-col for grouping message and source
                                                  msg.sender === 'user' ? "items-end" : "items-start"
                                              )}
                                          >
                                              <motion.div
                                                  className={cn(
                                                      "px-3 py-1.5 rounded-lg max-w-[85%] text-sm", // Slightly increased max-width
                                                      msg.sender === 'user'
                                                          ? "bg-primary text-primary-foreground"
                                                          : "bg-muted text-muted-foreground"
                                                  )}
                                                   initial={{ opacity: 0, y: 5 }}
                                                   animate={{ opacity: 1, y: 0 }}
                                                   transition={{ delay: index * 0.05 }} // Faster animation delay
                                              >
                                                  {msg.text}
                                              </motion.div>
                                              {/* Show AI source below AI messages */}
                                              {msg.sender === 'ai' && msg.aiSource && (
                                                 <span className="text-[10px] text-muted-foreground/70 mt-0.5 px-1 flex items-center gap-1">
                                                   {msg.aiSource === 'ChatGPT' ? <Bot className="h-2.5 w-2.5"/> : <Cpu className="h-2.5 w-2.5"/>}
                                                   {msg.aiSource}
                                                 </span>
                                              )}
                                          </div>
                                      ))}
                                  </div>
                              </ScrollArea>

                              <footer className="p-3 border-t">
                                  <form onSubmit={handleSend} className="flex gap-2">
                                      <Input
                                          value={inputValue}
                                          onChange={(e) => setInputValue(e.target.value)}
                                          placeholder="Ask anything..."
                                          className="flex-1 h-9"
                                          autoFocus
                                      />
                                      <Button type="submit" size="icon" className="h-9 w-9 flex-shrink-0 gold-button">
                                          <Send className="h-4 w-4" />
                                          <span className="sr-only">Send message</span>
                                      </Button>
                                  </form>
                              </footer>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </>
          );
      };

      export default AiChatWidget;
   