"use client"

// import { buttonVariants } from "@/components/ui/button";
// import Link from "next/link";
// import React from "react";

// export default async function Home() {

//   return (
//     <div className="flex flex-col items-center gap-5">
//       <Link href="/admin" className={buttonVariants()}>
//         Admin Page
//       </Link>
//     </div>
//   );
// }

// src/app/page.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return <div>Redirecting to dashboard...</div>;
}
