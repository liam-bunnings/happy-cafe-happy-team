'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../utils/api';

export default function ApiService() {
  const [status, setStatus] = useState({
    backend: 'Checking...',
    database: 'Checking...'
  });

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        // Check if backend is running
        const response = await fetch(API_ENDPOINTS.MENUS);
        if (response.ok) {
          setStatus(prev => ({ ...prev, backend: 'Connected' }));
          
          // If we can get menus, database is also connected
          setStatus(prev => ({ ...prev, database: 'Connected' }));
        } else {
          setStatus(prev => ({ ...prev, backend: 'Error connecting to API' }));
        }
      } catch (error) {
        console.error('Error checking backend status:', error);
        setStatus(prev => ({ ...prev, backend: 'Failed to connect' }));
      }
    };

    checkBackendStatus();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">API Integration Status</h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="font-medium mr-2">Backend API:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            status.backend === 'Connected' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status.backend}
          </span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium mr-2">Database:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            status.database === 'Connected' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status.database}
          </span>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-medium mb-2">Integration Notes</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>All frontend components are using the centralized API endpoints</li>
          <li>Restaurant interface can manage menus, orders, and suggestions</li>
          <li>Customer interface can view menus, place orders, and submit suggestions</li>
          <li>Data flows between frontend and backend through RESTful API calls</li>
        </ul>
      </div>
    </div>
  );
}
