'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signup, SignupRequest } from '../../lib/api';

export default function SignupPage() {
  const [form, setForm] = useState<SignupRequest>({
    email: '',
    password: '',
    displayName: '',
  });
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signup(form);
    router.push('/login');
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        data-testid="signup-email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        data-testid="signup-password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <input
        data-testid="signup-displayName"
        type="text"
        value={form.displayName}
        onChange={(e) => setForm({ ...form, displayName: e.target.value })}
      />
      <button data-testid="signup-submit" type="submit">
        Sign Up
      </button>
    </form>
  );
}
