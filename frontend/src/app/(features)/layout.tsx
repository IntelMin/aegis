'use client';

import React from 'react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar/sidebar';
import MobileSidebar from '@/components/sidebar/sidebar-mobile';

type Props = {
  children: React.ReactNode;
};

const UserLayout = ({ children }: Props) => {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <div className="max-md:hidden">
        <Sidebar />
      </div>
      {show && (
        <div className="h-full min-h-[100vh] z-[9] pt-20 md:hidden bg-black fixed">
          <MobileSidebar setShow={setShow} />
        </div>
      )}
      <div className="relative w-full">
        <Navbar show={show} setShow={setShow} />
        {children}
      </div>
    </>
  );
};

export default UserLayout;
