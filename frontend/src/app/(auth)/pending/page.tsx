'use client';

import { useSession, signOut } from 'next-auth/react';
import PendingContent from './content';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Pending = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If the session is loading, you can return a loader or null
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  console.log('-----------');
  console.log(session);

  if (session?.user) {
    return <PendingContent user={session.user} />;
  } else {
    // Perform client-side redirect if the user is not logged in
    // This should be in a useEffect to avoid React hydration issues
    router.replace('/login');
    // Optionally return null or a placeholder while redirecting
    return null;
  }
};

export default Pending;
