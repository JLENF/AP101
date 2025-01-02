import React from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  onSuccess: () => void;
}

export function AuthModal({ onSuccess }: AuthModalProps) {
  const [mode, setMode] = React.useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {mode === 'login' ? (
          <LoginForm
            onSuccess={onSuccess}
            onRegisterClick={() => setMode('register')}
          />
        ) : (
          <RegisterForm
            onSuccess={onSuccess}
            onLoginClick={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
}