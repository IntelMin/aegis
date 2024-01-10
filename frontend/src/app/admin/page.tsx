import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { FC } from 'react';

interface AdminProps {}

const Admin: FC<AdminProps> = async ({}) => {
  const session = await getServerSession(authOptions);

  function toggleWhiteList() {
    // ADD WHITELIST FUNCTION HERE ASLAM
  }

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
                <TableRow className="grid grid-cols-3 items-center border-b-1 ">
                  {' '}
                  <TableCell className="py-2 px-4 text-neutral-100 text-center">
                    Yuvraj Jwala
                  </TableCell>
                  <TableCell className="py-2 px-4 text-neutral-200 text-center">
                    yuvrajjwala@gmail.com
                  </TableCell>
                  <TableCell className="py-2 px-4 text-green-400 text-center">
                    <Switch
                      checked={true}
                      // onCheckedChange={toggleWhiteList}
                      aria-readonly
                    />
                  </TableCell>
                </TableRow>

                <TableRow className="grid grid-cols-3 items-center border-b border-1 bg-[#0E0E0E]">
                  {' '}
                  <TableCell className="py-2 px-4 text-neutral-100 text-center">
                    Kyono Suke
                  </TableCell>
                  <TableCell className="py-2 px-4 text-neutral-200 text-center">
                    Kyono@gmail.com
                  </TableCell>
                  <TableCell className="py-2 px-4 text-green-400 text-center">
                    <Switch
                      checked={false}
                      // onCheckedChange={toggleWhiteList}
                      aria-readonly
                    />
                  </TableCell>
                </TableRow>

                <TableRow className="grid grid-cols-3 items-center border-b-1 ">
                  {' '}
                  <TableCell className="py-2 px-4 text-neutral-100 text-center">
                    Aslam Mod.
                  </TableCell>
                  <TableCell className="py-2 px-4 text-neutral-200 text-center">
                    aslam@gmail.com
                  </TableCell>
                  <TableCell className="py-2 px-4 text-green-400 text-center">
                    <Switch
                      checked={true}
                      // onCheckedChange={toggleWhiteList}
                      aria-readonly
                    />
                  </TableCell>
                </TableRow>
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
