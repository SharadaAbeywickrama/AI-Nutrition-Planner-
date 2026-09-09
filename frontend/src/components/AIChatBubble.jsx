import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Trash2 } from 'lucide-react';

const TypingDots = () => (
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' }}>
    {[0,1,2].map(i => (
      <div key={i} style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.5)',
        animation: 'bounce 1.2s infinite',
        animationDelay: `${i * 0.2}s`
      }} />
    ))}
    <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
  </div>
);

const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hi! I am your AI Dietitian powered by Sri Lankan food data. Ask me anything about nutrition.',
    time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    setMessages(prev => [...prev, { role: 'user', content: userMsg, time }]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/rag_chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not connect to the AI server.', time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={{
          position: 'fixed', bottom: '90px', right: '20px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white', border: 'none', borderRadius: '50%',
          width: '56px', height: '56px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(59,130,246,0.5)', cursor: 'pointer', zIndex: 101
        }}>
          <MessageSquare size={24} />
        </button>
      )}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px', width: '340px', height: '460px',
          background: '#0f172a', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 102,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
        }}>
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✨</span> AI Dietitian
              <span style={{ fontSize: '0.65rem', background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '10px' }}>RAG</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setMessages([messages[0]])} title="Clear chat" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}>
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>
          </div>
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                <div style={{
                  background: msg.role === 'user' ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : 'rgba(255,255,255,0.07)',
                  padding: '0.75rem 1rem', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: '0.88rem', lineHeight: 1.5
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px', textAlign: msg.role === 'user' ? 'right' : 'left', paddingLeft: msg.role === 'assistant' ? '4px' : 0 }}>
                  {msg.time}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.07)', padding: '0.75rem 1rem', borderRadius: '18px 18px 18px 4px' }}>
                <TypingDots />
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about Sri Lankan nutrition..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.6rem 1rem', borderRadius: '20px', color: 'white', outline: 'none', fontSize: '0.88rem'
              }}
            />
            <button onClick={sendMessage} disabled={isLoading || !input.trim()} style={{
              background: input.trim() ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: '50%', width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s'
            }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBubble;
