'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

const LogoutPage = () => {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return <div>Logging out...</div>;
};

export default LogoutPage;
