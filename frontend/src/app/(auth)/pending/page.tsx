import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth';
import { LogOut } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import PendingContent from './content';

const Pending = async ({}) => {
  const session = await getServerSession(authOptions);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return <PendingContent user={session?.user} />;
};

export default Pending;
