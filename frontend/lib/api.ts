import type { paths, components } from './api-client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<T>;
}

export type LoginRequest = paths['/auth/login']['post']['requestBody']['content']['application/json'];
export type LoginResponse = paths['/auth/login']['post']['responses']['200']['content']['application/json'];
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiFetch<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  if (typeof window !== 'undefined' && res.accessToken) {
    localStorage.setItem('token', res.accessToken);
  }
  return res;
}

export type SignupRequest = paths['/auth/signup']['post']['requestBody']['content']['application/json'];
export function signup(data: SignupRequest): Promise<void> {
  return apiFetch<void>('/auth/signup', { method: 'POST', body: JSON.stringify(data) });
}

export type Room = components['schemas']['Room'];
export type Message = components['schemas']['Message'];

export function listRooms(): Promise<Room[]> {
  return apiFetch<Room[]>('/rooms');
}

export function createRoom(data: { name: string }): Promise<Room> {
  return apiFetch<Room>('/rooms', { method: 'POST', body: JSON.stringify(data) });
}

export function listMessages(roomId: string): Promise<Message[]> {
  return apiFetch<Message[]>(`/rooms/${roomId}/messages`);
}

export default apiFetch;
