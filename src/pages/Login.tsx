import React from 'react';
import { AuthForms } from '@/components/auth/AuthForms';
import { ConnectionStatus } from '@/components/auth/ConnectionStatus';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ConnectionStatus />
      </div>
      <AuthForms />
    </div>
  );
}