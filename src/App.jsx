import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState('session1');
  const [model, setModel] = useState('DeepSeek');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 系统提示词——SHANKS 的人设
  const SYSTEM_PROMPT = `你是 SHANKS，一个年上熟男，温柔引导型，外冷内热，有点闷骚，喜欢逗对方。说话风格：成熟、从容、偶尔带点调侃，会照顾对方的情绪，但不会太肉麻。称呼对方为"小朋友"或"小家伙"。`;

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
          model: model,
          systemPrompt: SYSTEM_PROMPT  // 把系统提示词发给后端
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
    <div style={{ display: 'flex', height: '100vh', fontFamily: '"Segoe UI", sans-serif', background: '#f7f3f0' }}>
      {/* 左侧边栏 */}
      <div style={{ width: '240px', background: '#ffffff', borderRight: '1px solid #e8e0d8', display: 'flex', flexDirection: 'column', padding: '16px', boxShadow: '2px 0 8px rgba(0,0,0,0.02)' }}>
        <button style={{ width: '100%', padding: '10px', background: '#e8ddd0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#4a3f38', marginBottom: '16px', fontSize: '14px' }}>
          ✨ 新建会话
        </button>
        <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#f5f0eb', marginBottom: '4px', cursor: 'pointer', fontSize: '14px', color: '#3a3a3a' }}>📌 今天的对话</div>
        <div style={{ padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', marginBottom: '4px', fontSize: '14px', color: '#888' }}>📌 昨天的闲聊</div>
        <div style={{ padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', color: '#888' }}>📌 之前的记录</div>
        <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: '1px solid #eee', fontSize: '13px', color: '#aaa' }}>
          🦁 SHANKS · 年上熟男
        </div>
      </div>

      {/* 右侧主区域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fcf9f7' }}>
        {/* 顶部 */}
        <div style={{ padding: '14px 28px', borderBottom: '1px solid #eee', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🦁</span>
            <span style={{ fontWeight: '600', fontSize: '18px', color: '#3d3d3d' }}>SHANKS</span>
            <span style={{ fontSize: '13px', color: '#aaa', background: '#f0edea', padding: '2px 10px', borderRadius: '20px' }}>温柔 · 熟男</span>
          </div>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', fontSize: '13px', outline: 'none' }}
          >
            <option>DeepSeek</option>
            <option>Claude</option>
          </select>
        </div>

        {/* 消息列表 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#bbb', marginTop: '60px', fontSize: '15px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🦁</div>
              <div style={{ fontSize: '20px', fontWeight: '500', color: '#888' }}>小家伙，今天想聊什么？</div>
              <div style={{ fontSize: '14px', color: '#ccc', marginTop: '6px' }}>我在这儿听着呢。</div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: '10px',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              {msg.role === 'assistant' && (
                <div style={{ fontSize: '32px', flexShrink: 0, marginTop: '4px' }}>🦁</div>
              )}
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: '18px',
                  background: msg.role === 'user' ? '#e8e0d8' : '#ffffff',
                  color: '#333',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  boxShadow: msg.role === 'assistant' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
                  border: msg.role === 'assistant' ? '1px solid #eee' : 'none',
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div style={{ fontSize: '28px', flexShrink: 0, marginTop: '4px' }}>🐣</div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-start' }}>
              <span style={{ fontSize: '32px' }}>🦁</span>
              <div style={{ padding: '12px 18px', borderRadius: '18px', background: '#fff', border: '1px solid #eee', color: '#999', fontSize: '14px' }}>
                正在想怎么回你……
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 底部输入框 */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid #eee', background: '#ffffff', display: 'flex', gap: '12px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="说点什么吧，小朋友……"
            style={{ flex: 1, padding: '12px 20px', borderRadius: '30px', border: '1px solid #ddd', outline: 'none', fontSize: '14px', background: '#f7f5f2' }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{ padding: '12px 28px', borderRadius: '30px', border: 'none', background: '#d4c5b8', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
          >
            发送 🦁
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;