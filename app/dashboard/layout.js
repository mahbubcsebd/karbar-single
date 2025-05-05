"use client"

import useUser from '@/_hooks/useUser';
import Footer from "@/_template/_components/Footer";
import Header from "@/_template/_components/Header";
import { useRouter } from 'next/navigation';
import DashboardSidebar from './_components/DashboardSidebar';

export default function Layout({ children }) {
    const {user} = useUser();
    const router = useRouter();

    return (
      <>
      <Header />
        <div className="py-10 dahsboard-page">
          <div className="container">
            <div className="grid items-stretch min-h-screen grid-cols-12 gap-5">
              <div className="h-full col-span-12 px-4 py-6 bg-white border border-gray-400 rounded-lg md:col-span-3">
                <DashboardSidebar />
              </div>
              <div className="h-full col-span-12 md:col-span-9">{children}</div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
}
