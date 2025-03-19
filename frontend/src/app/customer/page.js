'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const weeks = ['current', 'next'];
const timeSlots = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'];

export default function MenuView() {
  const [activeWeek, setActiveWeek] = useState('current');
  const [menus, setMenus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchAllMenus = async () => {
      setLoading(true);
      try {
        // Fetch menus for all days in the selected week
        const menuData = {};
        
        for (const day of days) {
          const response = await fetch(`happy-cafe-happy-team-production.up.railway.app/api/menus/${day}/${activeWeek}`);
          if (response.ok) {
            const data = await response.json();
            menuData[day] = data;
          } else if (response.status !== 404) {
            // Only set error if it's not a 404 (no menu found is expected for some days)
            setError('Failed to load some menus');
          }
        }
        
        setMenus(menuData);
        setError(null);
      } catch (error) {
        console.error('Error fetching menus:', error);
        setError('Failed to load menus. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllMenus();
  }, [activeWeek]);

  const toggleItemSelection = (item, day) => {
    const itemWithDay = { ...item, day };
    const existingItemIndex = selectedItems.findIndex(i => 
      i.name === item.name && i.day === day
    );
    
    if (existingItemIndex >= 0) {
      // Remove item if already selected
      const newSelectedItems = [...selectedItems];
      newSelectedItems.splice(existingItemIndex, 1);
      setSelectedItems(newSelectedItems);
    } else {
      // Add item with day information
      setSelectedItems([...selectedItems, { ...itemWithDay, quantity: 1 }]);
    }
  };

  const isItemSelected = (itemName, day) => {
    return selectedItems.some(item => item.name === itemName && item.day === day);
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      alert('Please select at least one menu item');
      return;
    }
    
    if (!customerName || !phoneNumber || !selectedTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    const orderData = {
      customerName,
      phoneNumber,
      pickupTime: selectedTime,
      week: activeWeek,
      items: selectedItems,
      totalPrice: calculateTotal(),
      day: selectedItems[0].day
    };
    
    try {
      const response = await fetch('happy-cafe-happy-team-production.up.railway.app/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        setOrderSuccess(true);
        setSelectedItems([]);
        setCustomerName('');
        setPhoneNumber('');
        setSelectedTime('');
      } else {
        const error = await response.json();
        alert(`Failed to place order: ${error.message}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again later.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Order Menu</h2>
      <p className="text-gray-600 mb-6">Order before 10am to receive your food that day.</p>
      
      {/* Week Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Select Week:</h3>
        <div className="flex space-x-4">
          {weeks.map((week) => (
            <button
              key={week}
              className={`px-4 py-2 rounded ${activeWeek === week ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setActiveWeek(week)}
            >
              {week.charAt(0).toUpperCase() + week.slice(1)} Week
            </button>
          ))}
        </div>
      </div>
      
      {/* Menu Display with Selection - Grouped by Days */}
      {loading ? (
        <p className="text-gray-500">Loading menus...</p>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      ) : Object.keys(menus).length === 0 ? (
        <p className="text-gray-500 italic">No menus available for this week.</p>
      ) : (
        <div>
          {days.map((day) => (
            <div key={day} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{day}</h3>
              
              {!menus[day] || !menus[day].items || menus[day].items.length === 0 ? (
                <p className="text-gray-500 italic">No menu items available for {day}.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menus[day].items.map((item, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 mr-4">
                        {/* Placeholder for food image */}
                        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                          <span className="text-xs text-gray-500">Food</span>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-medium">{item.name}</h4>
                        {item.description && (
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        )}
                        <p className="text-green-700 font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => toggleItemSelection(item, day)}
                        className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center ${
                          isItemSelected(item.name, day)
                            ? 'bg-yellow-400 text-white'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}
                      >
                        {isItemSelected(item.name, day) ? (
                          <span>✓</span>
                        ) : (
                          <span>+</span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Order Details Section */}
          {selectedItems.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Order Details</h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Selected Items:</h4>
                <div className="bg-gray-50 p-4 rounded">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span>{item.name} <span className="text-gray-500">({item.day})</span></span>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2 mt-2 font-bold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border rounded"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-3 py-2 border rounded"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Preference *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`px-4 py-2 rounded ${
                          selectedTime === time
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Order Success Message */}
          {orderSuccess && (
            <div className="mt-6 p-4 bg-green-100 text-green-800 rounded">
              <p className="font-medium">Your order has been placed successfully!</p>
              <p className="mt-2">Thank you for your order. You can pick up your food at the selected time.</p>
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setOrderSuccess(false)}
              >
                Place Another Order
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Link to Suggestions */}
      <div className="mt-8 pt-6 border-t">
        <p className="text-gray-600">
          Have suggestions for our menu? <Link href="/customer/suggestions" className="text-green-600 hover:underline">Share your feedback</Link>
        </p>
      </div>
    </div>
  );
}
