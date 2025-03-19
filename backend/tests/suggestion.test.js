const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Test data
const testSuggestion = {
  customerName: 'Test Customer',
  content: 'This is a test suggestion for the restaurant.'
};

describe('Suggestion API Tests', () => {
  let suggestionId;

  // Test creating a suggestion
  test('POST /api/suggestions - Create a new suggestion', async () => {
    const response = await request(app)
      .post('/api/suggestions')
      .send(testSuggestion);
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.customerName).toBe(testSuggestion.customerName);
    expect(response.body.content).toBe(testSuggestion.content);
    expect(response.body.status).toBe('new');
    
    suggestionId = response.body._id;
  });

  // Test getting all suggestions
  test('GET /api/suggestions - Get all suggestions', async () => {
    const response = await request(app).get('/api/suggestions');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test getting a suggestion by ID
  test('GET /api/suggestions/:id - Get suggestion by ID', async () => {
    const response = await request(app)
      .get(`/api/suggestions/${suggestionId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(suggestionId);
    expect(response.body.customerName).toBe(testSuggestion.customerName);
    expect(response.body.content).toBe(testSuggestion.content);
  });

  // Test updating suggestion status
  test('PATCH /api/suggestions/:id/status - Update suggestion status', async () => {
    const response = await request(app)
      .patch(`/api/suggestions/${suggestionId}/status`)
      .send({ status: 'reviewed' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('reviewed');
  });

  // Test deleting a suggestion
  test('DELETE /api/suggestions/:id - Delete a suggestion', async () => {
    const response = await request(app)
      .delete(`/api/suggestions/${suggestionId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Suggestion deleted');
  });

  // Clean up after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
