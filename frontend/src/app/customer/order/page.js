'use client';

import { useState, useEffect } from 'react';

export default function OrderPlacement() {
  const [days, setDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [weeks, setWeeks] = useState(['current', 'next']);
  const [activeWeek, setActiveWeek] = useState('current');
  const [activeDay, setActiveDay] = useState('Monday');
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    pickupTime: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/menus/${activeDay}/${activeWeek}`);
        if (response.ok) {
          const data = await response.json();
          setMenu(data);
          setError(null);
          // Reset selected items when menu changes
          setSelectedItems([]);
        } else if (response.status === 404) {
          setMenu(null);
          setError('No menu available for this day');
        } else {
          setError('Failed to load menu');
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        setError('Failed to load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [activeDay, activeWeek]);

  const handleItemSelect = (item) => {
    const existingItem = selectedItems.find(
      (selectedItem) => selectedItem._id === item._id
    );

    if (existingItem) {
      // Increment quantity if already selected
      setSelectedItems(
        selectedItems.map((selectedItem) =>
          selectedItem._id === item._id
            ? { ...selectedItem, quantity: selectedItem.quantity + 1 }
            : selectedItem
        )
      );
    } else {
      // Add new item with quantity 1
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // Remove item if quantity is less than 1
      setSelectedItems(selectedItems.filter((item) => item._id !== itemId));
    } else {
      // Update quantity
      setSelectedItems(
        selectedItems.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSubmitOrder = async () => {
    // Validate form
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.pickupTime) {
      setMessage({
        text: 'Please fill in all required fields',
        type: 'error'
      });
      return;
    }

    if (selectedItems.length === 0) {
      setMessage({
        text: 'Please select at least one item',
        type: 'error'
      });
      return;
    }

    // Prepare order data
    const orderData = {
      customerName: customerInfo.name,
      phoneNumber: customerInfo.phone,
      pickupTime: customerInfo.pickupTime,
      day: activeDay,
      week: activeWeek,
      items: selectedItems.map(item => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice: calculateTotal()
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setMessage({
          text: 'Order placed successfully! We will prepare your food for pickup.',
          type: 'success'
        });
        // Reset form
        setSelectedItems([]);
        setCustomerInfo({
          name: '',
          phone: '',
          pickupTime: ''
        });
      } else {
        const error = await response.json();
        setMessage({
          text: `Failed to place order: ${error.message}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage({
        text: 'Failed to place order. Please try again later.',
        type: 'error'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Place an Order</h2>

      {/* Week Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Select Week:</h3>
        <div className="flex space-x-4">
          {weeks.map((week) => (
            <button
              key={week}
              className={`px-4 py-2 rounded ${
                activeWeek === week
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
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
              className={`px-4 py-2 rounded ${
                activeDay === day
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setActiveDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Status Message */}
      {message.text && (
        <div
          className={`p-4 mb-4 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Menu Display */}
      <div className="mt-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {activeDay}'s Menu ({activeWeek.charAt(0).toUpperCase() + activeWeek.slice(1)} Week)
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading menu...</p>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-800 rounded">{error}</div>
        ) : !menu || !menu.items || menu.items.length === 0 ? (
          <p className="text-gray-500 italic">
            No menu items available for this day.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.items.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <h4 className="text-lg font-medium">{item.name}</h4>
                  <span className="font-medium text-green-700">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-gray-600 mt-1">{item.description}</p>
                )}
                <button
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  onClick={() => handleItemSelect(item)}
                >
                  Add to Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Items */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Order</h3>
        {selectedItems.length === 0 ? (
          <p className="text-gray-500 italic">No items selected yet.</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          className="px-2 py-1 bg-gray-200 rounded-l"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          className="px-2 py-1 bg-gray-200 rounded-r"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-right font-medium"
                  >
                    Total:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold">
                    ${calculateTotal().toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Information Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, name: e.target.value })
              }
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, phone: e.target.value })
              }
              placeholder="Your phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Time *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={customerInfo.pickupTime}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, pickupTime: e.target.value })
              }
              placeholder="e.g. 12:30 PM"
            />
          </div>
        </div>
      </div>

      {/* Submit Order Button */}
      <button
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        onClick={handleSubmitOrder}
        disabled={selectedItems.length === 0}
      >
        Place Order
      </button>
    </div>
  );
}
