const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Test data
const testOrder = {
  customerName: 'Test Customer',
  phoneNumber: '123-456-7890',
  pickupTime: '12:30 PM',
  day: 'Monday',
  week: 'current',
  items: [
    {
      name: 'Test Dish 1',
      price: 9.99,
      quantity: 2
    }
  ],
  totalPrice: 19.98
};

describe('Order API Tests', () => {
  let orderId;

  // Test creating an order
  test('POST /api/orders - Create a new order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send(testOrder);
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.customerName).toBe(testOrder.customerName);
    expect(response.body.status).toBe('pending');
    
    orderId = response.body._id;
  });

  // Test getting all orders
  test('GET /api/orders - Get all orders', async () => {
    const response = await request(app).get('/api/orders');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test getting orders by status
  test('GET /api/orders/status/:status - Get orders by status', async () => {
    const response = await request(app)
      .get('/api/orders/status/pending');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].status).toBe('pending');
  });

  // Test updating order status
  test('PATCH /api/orders/:id/status - Update order status', async () => {
    const response = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .send({ status: 'acknowledged' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('acknowledged');
  });

  // Test getting an order by ID
  test('GET /api/orders/:id - Get order by ID', async () => {
    const response = await request(app)
      .get(`/api/orders/${orderId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(orderId);
    expect(response.body.status).toBe('acknowledged');
  });

  // Test deleting an order
  test('DELETE /api/orders/:id - Delete an order', async () => {
    const response = await request(app)
      .delete(`/api/orders/${orderId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Order deleted');
  });

  // Clean up after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
