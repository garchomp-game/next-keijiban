'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login, LoginRequest } from '../../lib/api';

export default function LoginPage() {
  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' });
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(form);
    router.push('/rooms');
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        data-testid="login-email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        data-testid="login-password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button data-testid="login-submit" type="submit">
        Login
      </button>
    </form>
  );
}
