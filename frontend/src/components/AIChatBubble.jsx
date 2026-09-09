import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! Ask me any dietary question about Sri Lankan food.' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/rag_chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '100px', right: '20px',
            background: 'var(--accent-primary)', color: 'white',
            border: 'none', borderRadius: '50%', width: '56px', height: '56px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)', cursor: 'pointer', zIndex: 101
          }}
        >
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px', width: '320px', height: '400px',
          background: 'var(--bg-dark)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 102,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          {/* Header */}
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>✨</span> AI Dietitian (RAG)
            </div>
            <X size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setIsOpen(false)} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                padding: '0.75rem 1rem', borderRadius: '12px', maxWidth: '85%',
                fontSize: '0.9rem', lineHeight: 1.4
              }}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.9rem' }}>
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about Sri Lankan foods..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', color: 'white', outline: 'none' }}
            />
            <button 
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{ background: '#3b82f6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', opacity: isLoading || !input.trim() ? 0.5 : 1 }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBubble;
