'use client';

import { useState, useEffect, FormEvent } from 'react';
import { listMessages, Message } from '../../../lib/api';
import io, { Socket } from 'socket.io-client';

type PageProps = { params: { roomId: string } };

export default function RoomPage({ params }: PageProps) {
  const { roomId } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    listMessages(roomId).then(setMessages);
    const token = localStorage.getItem('token');
    const s = io('http://localhost:5000/ws', { auth: { token } });
    setSocket(s);
    s.emit('room:join', { roomId });
    s.on('message:new', (msg: Message) => {
      setMessages((m) => [...m, msg]);
    });
    return () => {
      s.emit('room:leave', { roomId });
      s.disconnect();
    };
  }, [roomId]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (socket && body) {
      socket.emit('message:create', { roomId, body });
      setBody('');
    }
  };

  return (
    <div>
      <ul data-testid="message-list">
        {messages.map((m) => (
          <li key={m.id} data-testid={`message-item-${m.id}`}>
            {m.body}
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit}>
        <input
          data-testid="message-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button data-testid="message-submit" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
