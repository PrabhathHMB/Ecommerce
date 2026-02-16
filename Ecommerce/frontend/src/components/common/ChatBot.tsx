import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'bot', text: 'Hi! I am your AI assistant. How can I help you today?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputText
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            if (token && token !== 'null' && token !== 'undefined') {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('http://localhost:8080/api/ai/chat', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ message: userMessage.text })
            });

            const data = await response.json();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: data.response || "Sorry, I didn't get a proper response."
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: "Sorry, I'm having trouble connecting at the moment."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            <button
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle chat"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>Customer Support</h3>
                        <span className="chatbot-status">Online</span>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.sender}`}>
                                <div className="message-bubble">{msg.text}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message bot">
                                <div className="message-bubble typing">...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type your question..."
                            disabled={loading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={loading || !inputText.trim()}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
