'use client';

import { useState, useEffect } from 'react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState('all');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchOrders();
  }, [activeStatus]);

  const fetchOrders = async () => {
    try {
      let url = 'https://happy-cafe-happy-team-production.up.railway.app/api/orders';
      if (activeStatus !== 'all') {
        url = `https://happy-cafe-happy-team-production.up.railway.app/api/orders/status/${activeStatus}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setMessage({ text: 'Failed to load orders', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage({ text: 'Failed to load orders', type: 'error' });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://happy-cafe-happy-team-production.up.railway.app/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setMessage({ text: 'Order status updated successfully!', type: 'success' });
        fetchOrders();
      } else {
        const error = await response.json();
        setMessage({ text: `Failed to update order: ${error.message}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setMessage({ text: 'Failed to update order', type: 'error' });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      
      {/* Status Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Filter by Status:</h3>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${activeStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActiveStatus('all')}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 rounded ${activeStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActiveStatus('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded ${activeStatus === 'acknowledged' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActiveStatus('acknowledged')}
          >
            Acknowledged
          </button>
          <button
            className={`px-4 py-2 rounded ${activeStatus === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActiveStatus('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      {/* Status Message */}
      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      {/* Orders List */}
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <p className="text-gray-500 italic">No orders found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">Customer</th>
                <th className="py-2 px-4 text-left">Phone</th>
                <th className="py-2 px-4 text-left">Pickup Time</th>
                <th className="py-2 px-4 text-left">Items</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2 px-4">{order._id.substring(0, 8)}...</td>
                  <td className="py-2 px-4">{order.customerName}</td>
                  <td className="py-2 px-4">{order.phoneNumber}</td>
                  <td className="py-2 px-4">{order.pickupTime}</td>
                  <td className="py-2 px-4">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4">{formatDate(order.createdAt)}</td>
                  <td className="py-2 px-4">
                    {order.status === 'pending' && (
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() => handleStatusChange(order._id, 'acknowledged')}
                      >
                        Acknowledge
                      </button>
                    )}
                    {order.status === 'acknowledged' && (
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleStatusChange(order._id, 'completed')}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
