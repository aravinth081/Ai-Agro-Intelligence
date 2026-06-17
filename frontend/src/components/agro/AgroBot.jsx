 import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, X, Bot } from 'lucide-react';

export default function AgroBot({ onClose }) {
  const [messages, setMessages] = useState([
    { text: "Hello! I am AgroBot. Ask me anything about AgroRisk AI+ or my creator.", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 1. SPEECH TO TEXT (Voice Typing) ---
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support voice typing.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // English (India). Tamil ku 'ta-IN' mathikalam
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? " " : "") + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // --- 2. TEXT TO SPEECH (Bot Reading Message) ---
  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop if already speaking
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 1; 
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  // --- 3. SEND MESSAGE ---
  const handleSend = () => {
    if (!input.trim()) return;

    // Add User Message
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    // Simulate Bot Response
    setTimeout(() => {
      const botReply = "I heard you! This is a voice-enabled demo response.";
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[500px] w-[350px] bg-[#121212] border border-[#2A3B2C] rounded-xl shadow-2xl overflow-hidden font-manrope">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-[#2A3B2C]">
        <div className="flex items-center gap-3">
          <div className="bg-[#4CAF50] p-1.5 rounded-full flex items-center justify-center">
            <Bot size={20} className="text-black" />
          </div>
          <h3 className="text-white font-bold text-sm tracking-wider font-outfit uppercase">Agrobot AI</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* --- CHAT AREA --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
                msg.sender === "user" 
                  ? "bg-[#4CAF50] text-black rounded-br-none" 
                  : "bg-[#2A3B2C] text-gray-200 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
            
            {/* Listen Button (Only for Bot Messages) */}
            {msg.sender === "bot" && (
              <button 
                onClick={() => speakMessage(msg.text)}
                className="mt-1 text-gray-400 hover:text-[#4CAF50] transition-colors flex items-center gap-1 text-xs"
                title="Listen to message"
              >
                <Volume2 size={14} /> Listen
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-3 bg-[#1A1A1A] border-t border-[#2A3B2C] flex items-center gap-2">
        
        {/* Input Field with Mic inside */}
        <div className="flex-1 flex items-center bg-[#252525] rounded-lg border border-[#333] focus-within:border-[#4CAF50] px-3 py-1">
          <input
            type="text"
            className="flex-1 bg-transparent text-white text-sm focus:outline-none py-2"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          
          <button 
            onClick={toggleListening}
            className={`p-1.5 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`}
            title="Voice Typing"
          >
            {isListening ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
        </div>

        {/* Send Button */}
        <button 
          onClick={handleSend}
          className="bg-[#4CAF50] hover:bg-[#45a049] text-black p-2.5 rounded-lg transition-colors flex items-center justify-center shrink-0"
        >
          <Send size={18} />
        </button>
      </div>

    </div>
  );
}