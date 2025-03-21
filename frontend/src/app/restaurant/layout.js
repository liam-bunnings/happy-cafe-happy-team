'use client';

import { useState } from 'react';
import {usePathname, useRouter} from 'next/navigation';
import Image from 'next/image';

export default function RestaurantLayout({ children }) {
  const [activeTab, setActiveTab] = useState('menu');
  const router = useRouter();
  const pathname = usePathname()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-green text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Happy Cafe</h1>
          <div className="flex justify-center w-full">
            <Image src="/Primary-Logo.svg" alt="Happy Cafe Logo" width={150} height={150} />
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-4 py-2 font-medium ${pathname === '/restaurant' ? 'text-primary-green border-b-2 border-primary-green' : 'text-gray-500 hover:text-primary-red'}`}
            onClick={() => router.push('/restaurant')}
          >
            Menu Management
          </button>
          <button 
            className={`px-4 py-2 font-medium ${pathname === '/restaurant/orders' ? 'text-primary-green border-b-2 border-primary-green' : 'text-gray-500 hover:text-primary-red'}`}
            onClick={() => router.push('/restaurant/orders')}
          >
            Order Management
          </button>
          <button 
            className={`px-4 py-2 font-medium ${pathname === '/restaurant/suggestions' ? 'text-primary-green border-b-2 border-primary-green' : 'text-gray-500 hover:text-primary-red'}`}
            onClick={() => router.push('/restaurant/suggestions')}
          >
            Suggestions
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
}
