'use client';

import { useState, useEffect } from 'react';

export default function SuggestionsView() {
  const [suggestions, setSuggestions] = useState([]);
  const [activeStatus, setActiveStatus] = useState('all');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('https://happy-cafe-happy-team-production.up.railway.app/api/suggestions');
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        setMessage({ text: 'Failed to load suggestions', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setMessage({ text: 'Failed to load suggestions', type: 'error' });
    }
  };

  const handleStatusChange = async (suggestionId, newStatus) => {
    try {
      const response = await fetch(`https://happy-cafe-happy-team-production.up.railway.app/api/suggestions/${suggestionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setMessage({ text: 'Suggestion status updated successfully!', type: 'success' });
        fetchSuggestions();
      } else {
        const error = await response.json();
        setMessage({ text: `Failed to update suggestion: ${error.message}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error updating suggestion:', error);
      setMessage({ text: 'Failed to update suggestion', type: 'error' });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredSuggestions = activeStatus === 'all' 
    ? suggestions 
    : suggestions.filter(suggestion => suggestion.status === activeStatus);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Customer Suggestions</h2>
      
      {/* Status Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Filter by Status:</h3>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${activeStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActiveStatus('all')}
          >
            All Suggestions
          </button>
          <button
            className={`px-4 py-2 rounded ${activeStatus === 'new' ? 'bg-yellow-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActiveStatus('new')}
          >
            New
          </button>
          <button
            className={`px-4 py-2 rounded ${activeStatus === 'reviewed' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActiveStatus('reviewed')}
          >
            Reviewed
          </button>
        </div>
      </div>
      
      {/* Status Message */}
      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <p className="text-gray-500 italic">No suggestions found.</p>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <div key={suggestion._id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">From: {suggestion.customerName}</h3>
                  <p className="text-sm text-gray-500">Submitted: {formatDate(suggestion.createdAt)}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium
                  ${suggestion.status === 'new' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                </span>
              </div>
              <div className="mt-2 p-3 bg-white rounded border">
                <p>{suggestion.content}</p>
              </div>
              {suggestion.status === 'new' && (
                <div className="mt-2 text-right">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    onClick={() => handleStatusChange(suggestion._id, 'reviewed')}
                  >
                    Mark as Reviewed
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
