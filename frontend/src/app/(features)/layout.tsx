import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar/sidebar';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="relative w-full">
        <Navbar />
        {children}
      </div>
    </>
  );
}
