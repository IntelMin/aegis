'use client';

import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react';

interface AdminProps {}
interface UserstableProps {
  id: number;
  username: string;
  email: string;
  whitelisted: boolean;
  created_at: Date;
  updated_at: Date;
}
const Admin: FC<AdminProps> = ({}) => {
  const { data: session } = useSession();
  const [userstable, setUserstable] = useState<UserstableProps[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const toggleWhiteList = async (user_id: number) => {
    setLoading(true);
    const toggle = await fetch('/api/admin/whitelistuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id }),
    });
    if (!toggle.ok) {
    } else {
      setUserstable(prevUsers =>
        prevUsers?.map(user =>
          user.id === user_id
            ? { ...user, whitelisted: !user.whitelisted }
            : user
        )
      );
    }
    setLoading(false);
  };
  useEffect(() => {
    async function getUsers() {
      const users = await fetch('/api/admin/getusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(users);
      const data = await users?.json();
      console.log(data);
      setUserstable(data);
    }
    getUsers();
  }, []);
  console.log(userstable);
  if (userstable?.length === 0)
    return <div className="text-2xl font-bold">No users found!!!</div>;
  if (session?.user) {
    return (
      <>
        <div className="p-10 w-full">
          <h2 className="text-2xl font-bold">
            Welcome Back{' '}
            <span className="text-sky-600">
              {session?.user.username.charAt(0).toUpperCase() +
                session?.user.username.slice(1)}
            </span>
          </h2>

          <div className="w-full overflow-x-auto mt-6">
            <Table className="p-3 mt-6 border border-zinc-800 w-full">
              <TableHeader className="grid grid-cols-3 bg-gray-800">
                {' '}
                {/* 3 columns grid */}
                <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
                  User Name
                </TableHead>
                <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
                  User Email
                </TableHead>
                <TableHead className="py-3 px-4 text-neutral-400 text-[11px] font-[500] uppercase text-center">
                  Whitelist Status
                </TableHead>
              </TableHeader>
              <TableBody>
                {userstable?.map(user => (
                  <TableRow
                    key={user.email}
                    className="grid grid-cols-3 items-center border-b-1 "
                  >
                    {' '}
                    <TableCell className="py-2 px-4 text-neutral-100 text-center">
                      {user.username}
                    </TableCell>
                    <TableCell className="py-2 px-4 text-neutral-200 text-center">
                      {user.email}
                    </TableCell>
                    <TableCell className="py-2 px-4 text-green-400 text-center">
                      <Switch
                        checked={user.whitelisted}
                        onCheckedChange={() => toggleWhiteList(user.id)}
                        aria-readonly
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="text-2xl font-bold">
      <span className="text-red-500">Please login</span> to see admin page!!!
    </div>
  );
};

export default Admin;
