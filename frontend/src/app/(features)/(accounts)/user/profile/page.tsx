import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import React from 'react';
import { BiPencil } from 'react-icons/bi';

const UserAccountTable = () => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col pb-8">
        <h1 className="text-lg font-semibold">Your profile</h1>
        <p className="text-md text-zinc-500">Update your information</p>
      </div>
      <div className="border shadow-sm rounded-lg border-zinc-800 p-4 mb-4">
        <h2 className="text-md pb-4">Personal</h2>
        <div className="flex flex-col gap-6 md:flex-row md:gap-8 text-zinc-400">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input disabled={true} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input disabled={true} id="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Type</Label>
            <Input disabled={true} id="phone" />
          </div>
        </div>
      </div>
      <div className="border shadow-sm rounded-lg border-zinc-800 p-4 mb-4">
        <h2 className="text-md pb-4">Socials</h2>
        <div className="flex flex-col gap-6 md:flex-row md:gap-8 text-zinc-400">
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <Label htmlFor="name">Twitter</Label>
              <Input disabled={true} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Telegram</Label>
              <Input disabled={true} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <Label htmlFor="name">Discord</Label>
              <Input disabled={true} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Instagram</Label>
              <Input disabled={true} />
            </div>
          </div>
        </div>
      </div>
      <div className=" shadow-sm">
        <Button disabled>
          <BiPencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  );
};

export default UserAccountTable;
