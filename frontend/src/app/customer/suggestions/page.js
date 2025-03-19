'use client';

import { useState } from 'react';

export default function SuggestionSubmission() {
  const [suggestion, setSuggestion] = useState({
    customerName: '',
    content: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!suggestion.customerName || !suggestion.content) {
      setMessage({
        text: 'Please fill in all required fields',
        type: 'error'
      });
      return;
    }

    try {
      const response = await fetch('happy-cafe-happy-team-production.up.railway.app/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(suggestion)
      });

      if (response.ok) {
        setMessage({
          text: 'Thank you for your suggestion! We appreciate your feedback.',
          type: 'success'
        });
        // Reset form
        setSuggestion({
          customerName: '',
          content: ''
        });
      } else {
        const error = await response.json();
        setMessage({
          text: `Failed to submit suggestion: ${error.message}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setMessage({
        text: 'Failed to submit suggestion. Please try again later.',
        type: 'error'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Submit a Suggestion</h2>
      
      {/* Status Message */}
      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            id="customerName"
            className="w-full px-3 py-2 border rounded"
            value={suggestion.customerName}
            onChange={(e) => setSuggestion({...suggestion, customerName: e.target.value})}
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Your Suggestion *
          </label>
          <textarea
            id="content"
            rows="6"
            className="w-full px-3 py-2 border rounded"
            value={suggestion.content}
            onChange={(e) => setSuggestion({...suggestion, content: e.target.value})}
            placeholder="Share your thoughts, ideas, or feedback with us..."
          ></textarea>
        </div>
        
        <div>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Suggestion
          </button>
        </div>
      </form>
      
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-medium mb-2">Why Submit a Suggestion?</h3>
        <p className="text-gray-600">
          We value your feedback and are constantly looking to improve our menu and service. 
          Whether you have ideas for new dishes, improvements to existing ones, or any other 
          thoughts about our restaurant, we'd love to hear from you!
        </p>
      </div>
    </div>
  );
}
