'use client';

import Image from 'next/image';
import {usePathname, useRouter} from 'next/navigation';
import { Suspense } from 'react';

export default function CustomerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname()
  console.log(pathname)
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-primary-green text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold whitespace-nowrap cursor-pointer" onClick={() => router.push('/')}>Happy Cafe</h1>
            <div className="flex justify-center w-full">
              <Image src="/Primary-Logo.svg" alt="Happy Cafe Logo" width={150} height={150} />
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-6">
          <div className="flex border-b border-gray-200 mb-6 whitespace-nowrap">
            <button 
              className={`px-4 py-2 font-medium ${pathname === '/customer' ? 'text-primary-green border-b-2 border-primary-green' : 'text-gray-500 hover:text-primary-red'}`}
              onClick={() => router.push('/customer')}
            >
              View Menu
            </button>
            <button 
              className={`px-4 py-2 font-medium ${pathname === '/customer/suggestions' ? 'text-primary-green border-b-2 border-primary-green' : 'text-gray-500 hover:text-primary-red'}`}
              onClick={() => router.push('/customer/suggestions')}
            >
              Submit Suggestion
            </button>
          </div>
          
          {children}
        </div>
      </div>
    </Suspense>
  );
}
