'use client';

import { SessionProvider, signOut, useSession } from 'next-auth/react';
import { Toaster } from 'sonner';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
      <Toaster />
    </SessionProvider>
  );
}

function SessionSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error === 'SessionRevoked') {
      signOut({ callbackUrl: '/auth/login' });
    }
  }, [session]);

  return null;
}
