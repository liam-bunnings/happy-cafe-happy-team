const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Test data
const testMenu = {
  day: 'Monday',
  week: 'current',
  items: [
    {
      name: 'Test Dish 1',
      description: 'Test description 1',
      price: 9.99
    },
    {
      name: 'Test Dish 2',
      description: 'Test description 2',
      price: 12.99
    }
  ]
};

describe('Menu API Tests', () => {
  let menuId;

  // Test creating a menu
  test('POST /api/menus - Create a new menu', async () => {
    const response = await request(app)
      .post('/api/menus')
      .send(testMenu);
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.day).toBe(testMenu.day);
    expect(response.body.week).toBe(testMenu.week);
    expect(response.body.items.length).toBe(2);
    
    menuId = response.body._id;
  });

  // Test getting all menus
  test('GET /api/menus - Get all menus', async () => {
    const response = await request(app).get('/api/menus');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test getting a menu by day and week
  test('GET /api/menus/:day/:week - Get menu by day and week', async () => {
    const response = await request(app)
      .get(`/api/menus/${testMenu.day}/${testMenu.week}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.day).toBe(testMenu.day);
    expect(response.body.week).toBe(testMenu.week);
  });

  // Test updating a menu
  test('POST /api/menus - Update an existing menu', async () => {
    const updatedMenu = {
      ...testMenu,
      items: [
        ...testMenu.items,
        {
          name: 'Test Dish 3',
          description: 'Test description 3',
          price: 14.99
        }
      ]
    };

    const response = await request(app)
      .post('/api/menus')
      .send(updatedMenu);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.items.length).toBe(3);
  });

  // Test deleting a menu
  test('DELETE /api/menus/:id - Delete a menu', async () => {
    const response = await request(app)
      .delete(`/api/menus/${menuId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Menu deleted');
  });

  // Clean up after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
