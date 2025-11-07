import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { socket } from '../socket';
import defaultAvatar from '../assets/default-user.png';

// Chat Page, shows up only for in Progress quests.
function ChatPage() {
    const { questId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [questInfo, setQuestInfo] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // 1. Connect to the socket server
        socket.connect();

        // 2. Tell the server we want to join this quest's room
        socket.emit('joinRoom', { questId, userId: user._id });

        // 3. Listen for a single 'questDetails' event
        socket.once('questDetails', ({ quest, otherUser }) => {
            setQuestInfo(quest);
            setOtherUser(otherUser);
        });

        // 4. Listen for new messages
        const messageListener = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };
        socket.on('receiveMessage', messageListener);

        // 5. Listen for previous messages
        const historyListener = (messageHistory) => {
            setMessages(messageHistory);
        };
        socket.on('messageHistory', historyListener);

        // 6. Clean up on unmount
        return () => {
            socket.off('receiveMessage', messageListener);
            socket.off('messageHistory', historyListener);
            socket.emit('leaveRoom', { questId });
            socket.disconnect();
        };
    }, [questId]);

    // Effect to scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const messageData = {
            questId,
            senderId: user._id,
            text: newMessage.trim(),
        };

        // Emit the message to the server
        socket.emit('sendMessage', messageData);

        // Add our own message to the chat UI instantly
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setNewMessage('');
    };

    if (!questInfo || !otherUser) {
        return (
            <main className="chat-container">
                <div className="chat-header">
                    <h2>Loading Chat...</h2>
                </div>
            </main>
        );
    }

    return (
        <main className="chat-container">
            <div className="chat-header">
                <Link to="/dashboard" className="chat-back-btn">← Back</Link>
                <img
                    src={otherUser.profilePictureUrl || defaultAvatar}
                    alt={otherUser.name}
                    className="user-avatar"
                />
                <div className="chat-header-info">
                    <h2>{otherUser.name}</h2>
                    <p>RE: {questInfo.itemsList}</p>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.senderId === user._id ? 'sent' : 'received'}`}
                    >
                        <p>{msg.text}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button type="submit" className="chat-send-btn">Send</button>
            </form>
        </main>
    );
}

export default ChatPage;