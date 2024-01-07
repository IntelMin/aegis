'use client';

import { signOut } from 'next-auth/react';

export default function SignoutButton() {
  return (
    <button
      className="bg-[#0E76FD] font-[300] text-white px-12 py-3 rounded-md mt-5"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  );
}
