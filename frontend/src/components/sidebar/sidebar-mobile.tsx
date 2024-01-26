'use client';

import React from 'react';
import { navArr } from './side-items';
import SidebarSectionTitle from './sidebar-section-title';
import SidebarItems from './sidebar-items';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SidebarFooter from './sidebar-footer';

type Props = {
  setShow?: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileSidebar = ({ setShow }: Props) => {
  const session = useSession();
  const router = useRouter();
  const open = 2;
  return (
    <div className="w-[100vw] flex flex-col justify-between h-full p-8">
      <div>
        <div className="grid grid-cols-2 gap-6 px-24">
          <button
            type="button"
            onClick={() => {
              router.push('/user/profile');
              if (setShow) setShow(false);
            }}
            className="col-span-2 bg-zinc-800 p-3 rounded-[4px] flex justify-center gap-2 items-center text-white text-[16px] mb-3 font-[300]"
          >
            <Image
              alt="user"
              src="/icons/user.png"
              width={18}
              height={18}
              className="-translate-y-[1px]"
            />
            Profile
          </button>
        </div>
        <div className="flex flex-col gap-3 w-full">
          {navArr?.map(ele => (
            <div key={ele?.title} className="flex flex-col gap-3">
              <SidebarSectionTitle ele={ele} open={open} />
              <div className="flex flex-col gap-3">
                {ele?.children?.map(item => (
                  <SidebarItems
                    key={item?.name}
                    item={item}
                    open={open}
                    setShow={setShow}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {session.status == 'authenticated' && (
          <button
            type="button"
            className="w-full bg-[#0E76FD] font-[300] text-white py-3 mt-12"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        )}
      </div>
      <SidebarFooter open={open} />
    </div>
  );
};

export default MobileSidebar;
