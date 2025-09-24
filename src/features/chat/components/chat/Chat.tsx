import { useState } from 'react';
import { socket } from '../../../services/socketio';

export function Chat() {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('chat message');
        };
    }, []);

    return (
        <div>
            <h2>Chat</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}