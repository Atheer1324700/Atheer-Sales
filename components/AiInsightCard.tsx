import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
    sender: 'ai' | 'user';
    text: string;
}

interface AiInsightCardProps {
    initialInsight: string;
    chatHistory: ChatMessage[];
    isLoading: boolean;
    isAnswering: boolean;
    error: string;
    onRefresh: () => void;
    onAsk: (query: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center p-2">
        <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
        </div>
    </div>
);

const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
    const content = text.split('\n').map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            return <li key={index}>{trimmedLine.substring(1).trim()}</li>;
        }
        if (trimmedLine) {
            return <p key={index} className="my-1">{trimmedLine}</p>;
        }
        return null;
    }).filter(Boolean);

    // Check if the content is mainly a list or paragraph
    const isList = content.some(c => c?.type === 'li');

    if (isList) {
        return (
            <div className="prose prose-invert prose-sm max-w-none">
                <ul className="list-disc pr-4 space-y-1">{content}</ul>
            </div>
        );
    }
    return <div className="prose prose-invert prose-sm max-w-none">{content}</div>;
};

export const AiInsightCard: React.FC<AiInsightCardProps> = ({ initialInsight, chatHistory, isLoading, isAnswering, error, onRefresh, onAsk }) => {
    const [query, setQuery] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, isAnswering]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAsk(query);
        setQuery('');
    };

    const hasChatStarted = chatHistory.length > 0;

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-96 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">مساعد التحليل الذكي</h3>
                <button onClick={onRefresh} disabled={isLoading || isAnswering} className="text-gray-400 hover:text-white transition-colors disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-2 mb-4 space-y-4">
                {isLoading ? <div className="flex justify-center items-center h-full"><LoadingSpinner /></div> : 
                 error ? <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">{error}</div> :
                 (
                    <>
                        {!hasChatStarted && <FormattedMessage text={initialInsight} />}
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-sm rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    {msg.sender === 'ai' ? <FormattedMessage text={msg.text} /> : msg.text}
                                </div>
                            </div>
                        ))}
                        {isAnswering && (
                            <div className="flex justify-start">
                                <div className="max-w-xs md:max-w-md lg:max-w-sm rounded-lg px-4 py-2 bg-gray-700 text-gray-200">
                                    <LoadingSpinner />
                                </div>
                            </div>
                        )}
                    </>
                 )
                }
            </div>
            <form onSubmit={handleFormSubmit}>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="اسأل عن بياناتك..."
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:opacity-50"
                        disabled={isLoading || isAnswering}
                    />
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50" disabled={isLoading || isAnswering || !query.trim()}>
                        إرسال
                    </button>
                </div>
            </form>
        </div>
    );
};