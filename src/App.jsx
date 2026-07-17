import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('session1');
  const [model, setModel] = useState('Claude');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://bunny-backend-deploy.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          sessionId: sessionId,
          model: model
        })
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('发送失败:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ 连接服务器失败，请确认后端已启动。' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ width: '240px', background: '#ffffff', borderRight: '1px solid #e8e0d8', display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <button style={{ width: '100%', padding: '10px', background: '#f5f0eb', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '16px' }}>
          + 新建会话
        </button>
        <div style={{ padding: '10px', borderRadius: '8px', background: '#f9f6f3', marginBottom: '4px', cursor: 'pointer' }}>会话 1</div>
        <div style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px' }}>会话 2</div>
        <div style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>会话 3</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fcf9f7' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8e0d8', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: '500', fontSize: '14px', color: '#666' }}>模型：</span>
          <select 
            value={model} 
            onChange={(e) => setModel(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff' }}
          >
            <option>Claude</option>
            <option>DeepSeek</option>
          </select>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
              开始你的第一次对话吧 ✨
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                padding: '12px 18px',
                borderRadius: '16px',
                background: msg.role === 'user' ? '#e8e0d8' : '#f9e8e0',
                color: '#333',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', padding: '12px 18px', borderRadius: '16px', background: '#f0ece8', color: '#999' }}>
              AI 正在思考...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #e8e0d8', background: '#ffffff', display: 'flex', gap: '12px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            style={{ flex: 1, padding: '10px 16px', borderRadius: '24px', border: '1px solid #ddd', outline: 'none' }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{ padding: '10px 24px', borderRadius: '24px', border: 'none', background: '#d4c5b8', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;