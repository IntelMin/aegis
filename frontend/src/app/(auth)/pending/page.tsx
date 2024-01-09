import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import PendingContent from './content';

const Pending = async ({}) => {
  const session = await getServerSession(authOptions);

  console.log(session);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return <PendingContent user={session?.user} />;
};

export default Pending;
