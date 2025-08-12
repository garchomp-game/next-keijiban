'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { listRooms, createRoom, Room } from '../../lib/api';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    listRooms().then(setRooms);
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const room = await createRoom({ name });
    setRooms([...rooms, room]);
    setName('');
  };

  return (
    <div>
      <ul data-testid="room-list">
        {rooms.map((room) => (
          <li key={room.id}>
            <button
              data-testid={`room-item-${room.id}`}
              onClick={() => router.push(`/rooms/${room.id}`)}
            >
              {room.name}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit}>
        <input
          data-testid="create-room-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button data-testid="create-room-submit" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}
