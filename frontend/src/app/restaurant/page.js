'use client';

import { useState, useEffect } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const weeks = ['current', 'next'];

export default function MenuManagement() {
  const [activeWeek, setActiveWeek] = useState('current');
  const [activeDay, setActiveDay] = useState('Monday');
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  // Load menu data when week or day changes
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`https://happy-cafe-happy-team-production.up.railway.app/api/menus/${activeDay}/${activeWeek}`);
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data.items || []);
        } else if (response.status === 404) {
          // Menu doesn't exist yet for this day/week
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        setMessage({ text: 'Failed to load menu data', type: 'error' });
      }
    };

    fetchMenu();
  }, [activeDay, activeWeek]);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      setMessage({ text: 'Name and price are required', type: 'error' });
      return;
    }

    setMenuItems([...menuItems, { ...newItem, price: parseFloat(newItem.price) }]);
    setNewItem({ name: '', description: '', price: '' });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...menuItems];
    updatedItems.splice(index, 1);
    setMenuItems(updatedItems);
  };

  const handleSaveMenu = async () => {
    try {
      const response = await fetch('https://happy-cafe-happy-team-production.up.railway.app/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          day: activeDay,
          week: activeWeek,
          items: menuItems
        }),
      });

      if (response.ok) {
        setMessage({ text: 'Menu saved successfully!', type: 'success' });
      } else {
        const error = await response.json();
        setMessage({ text: `Failed to save menu: ${error.message}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      setMessage({ text: 'Failed to save menu', type: 'error' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Menu Management</h2>
      
      {/* Week Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Select Week:</h3>
        <div className="flex space-x-4">
          {weeks.map((week) => (
            <button
              key={week}
              className={`px-4 py-2 rounded ${activeWeek === week ? 'bg-primary-green text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setActiveWeek(week)}
            >
              {week.charAt(0).toUpperCase() + week.slice(1)} Week
            </button>
          ))}
        </div>
      </div>
      
      {/* Day Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Select Day:</h3>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day}
              className={`px-4 py-2 rounded ${activeDay === day ? 'bg-primary-green text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setActiveDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      
      {/* Status Message */}
      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      {/* Current Menu Items */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Menu Items for {activeDay}, {activeWeek.charAt(0).toUpperCase() + activeWeek.slice(1)} Week:</h3>
        
        {menuItems.length === 0 ? (
          <p className="text-gray-500 italic">No items added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-left">Price</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4">{item.description}</td>
                    <td className="py-2 px-4">${item.price.toFixed(2)}</td>
                    <td className="py-2 px-4">
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add New Item Form */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Add New Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              placeholder="Item name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              placeholder="Item description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border rounded"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              placeholder="0.00"
            />
          </div>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-primary-red text-white rounded hover:bg-secondary-red"
          onClick={handleAddItem}
        >
          Add Item
        </button>
      </div>
      
      {/* Save Menu Button */}
      <button
        className="px-6 py-2 bg-primary-green text-white rounded hover:bg-blue-700"
        onClick={handleSaveMenu}
      >
        Save Menu
      </button>
    </div>
  );
}
