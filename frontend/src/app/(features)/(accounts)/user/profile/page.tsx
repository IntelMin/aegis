'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import React from 'react';
import { BiPencil } from 'react-icons/bi';
import { IoLogoDiscord } from 'react-icons/io5';
import { FaXTwitter } from 'react-icons/fa6';
import { FaTelegram, FaInstagram } from 'react-icons/fa';

const UserAccountTable = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col pb-4">
        <h1 className="text-lg font-semibold">Your profile</h1>
        {isEditing && (
          <p className="text-md text-zinc-500">Update your information</p>
        )}
      </div>
      <div className="border shadow-sm rounded-lg border-zinc-800 p-4 mb-4">
        <h2 className="text-md pb-3 mb-4 border-b border-zinc-800">
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-6 md:flex-row md:gap-8 text-zinc-50">
          <div className="col-span-1 space-y-2">
            <Label className="flex gap-2 items-center" htmlFor="name">
              First name
            </Label>
            <Input
              disabled={true}
              placeholder="First name"
              style={{
                border: '1px solid var(--zinc-800, #27272A)',
                background:
                  'linear-gradient(160deg, #18181B 13.54%, #18181B 64.41%)',
              }}
            />
          </div>
          <div className="col-span-1 space-y-2">
            <Label className="flex gap-2 items-center" htmlFor="phone">
              Last name
            </Label>
            <Input
              disabled={true}
              placeholder="Last name"
              style={{
                border: '1px solid var(--zinc-800, #27272A)',
                background:
                  'linear-gradient(160deg, #18181B 13.54%, #18181B 64.41%)',
              }}
              id="phone"
            />
          </div>
          <div className="col-span-1 space-y-2">
            <Label className="flex gap-2 items-center" htmlFor="email">
              Email
            </Label>
            <Input
              disabled={true}
              placeholder="Enter your email address"
              style={{
                border: '1px solid var(--zinc-800, #27272A)',
                background:
                  'linear-gradient(160deg, #18181B 13.54%, #18181B 64.41%)',
              }}
              id="email"
            />
          </div>
        </div>
      </div>
      <div className="border shadow-sm rounded-lg border-zinc-800 p-4 mb-4">
        <h2 className="text-md pb-3 mb-4 border-b border-zinc-800">Socials</h2>
        <div className="grid grid-cols-1 gap-6 md:flex-row md:gap-8 text-zinc-50">
          <div className="col-span-1 grid grid-cols-2 gap-6">
            <div className="col-span-1 space-y-2">
              <Label className="flex gap-2 items-center" htmlFor="name">
                <FaXTwitter />X
              </Label>
              <Input
                disabled={true}
                placeholder="@username"
                style={{
                  border: '1px solid var(--zinc-800, #27272A)',
                  background:
                    'linear-gradient(160deg, #18181B 13.54%, #18181B 64.41%)',
                }}
              />
            </div>
            <div className="col-span-1 space-y-2">
              <Label className="flex gap-2 items-center" htmlFor="email">
                <IoLogoDiscord /> Discord
              </Label>
              <Input
                disabled={true}
                placeholder="@username"
                style={{
                  border: '1px solid var(--zinc-800, #27272A)',
                  background:
                    'linear-gradient(160deg, #18181B 13.54%, #18181B 64.41%)',
                }}
              />
            </div>
          </div>
          <div className="col-span-1 grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-1">
              <Label className="flex gap-2 items-center" htmlFor="name">
                <FaTelegram />
                Telegram
              </Label>
              <Input
                disabled={true}
                placeholder="@username"
                style={{
                  border: '1px solid var(--zinc-800, #27272A)',
                  background:
                    'linear-gradient(160deg, #18181B 13.54%, #18181B 64.41%)',
                }}
              />
            </div>
            <div className="space-y-2 col-span-1">
              <Label className="flex gap-2 items-center" htmlFor="email">
                <FaInstagram /> Instagram
              </Label>
              <Input
                disabled={true}
                placeholder="@username"
                style={{
                  border: '1px solid var(--zinc-800, #27272A)',
                  background:
                    'linear-gradient(160deg, #18181B 13.54%, #18181B 64.41%)',
                }}
              />
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
