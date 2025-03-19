'use client';

import {usePathname, useRouter} from 'next/navigation';

export default function CustomerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname()
  console.log(pathname)
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Restaurant Menu System</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-4 py-2 font-medium ${pathname === '/customer' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => router.push('/customer')}
          >
            View Menu
          </button>
          {/* <button 
            className={`px-4 py-2 font-medium ${activeTab === 'order' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('/customer/order')}
          >
            Place Order
          </button> */}
          <button 
            className={`px-4 py-2 font-medium ${pathname === '/customer/suggestions' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => router.push('/customer/suggestions')}
          >
            Submit Suggestion
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
}
