'use client';

import { useState } from 'react';
import {usePathname, useRouter} from 'next/navigation';

export default function RestaurantLayout({ children }) {
  const [activeTab, setActiveTab] = useState('menu');
  const router = useRouter();
  const pathname = usePathname()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Restaurant Management Portal</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-4 py-2 font-medium ${pathname === '/restaurant' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => router.push('/restaurant')}
          >
            Menu Management
          </button>
          <button 
            className={`px-4 py-2 font-medium ${pathname === '/restaurant/orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => router.push('/restaurant/orders')}
          >
            Order Management
          </button>
          <button 
            className={`px-4 py-2 font-medium ${pathname === '/restaurant/suggestions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
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
