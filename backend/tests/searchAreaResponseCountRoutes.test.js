const request = require('supertest');
const app = require('../server'); 
const SearchAreaResponseCount = require('../models/searchAreaResponseCount');

describe('POST /searchAreaResponseCount', () => {
    test('It should create a new search area response count', async () => {
        // Mock the request body
        const searchData = {
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000,
            included_types: ['restaurant'],
            excluded_types: ['bar'],
            response_count: 10
        };

        // Make a POST request to create a new search area response count
        const response = await request(app)
            .post('/api/searchAreaResponseCount')
            .send(searchData);

        // Assert the response status code and body
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
    });
});

describe('GET /searchAreaResponseCounts/:id', () => {
    let createdSearchAreaResponseCountId;

    beforeAll(async () => {
        // Mock a search area response count
        const searchData = {
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000,
            included_types: ['restaurant'],
            excluded_types: ['bar'],
            response_count: 10
        };

        // Create a search area response count
        const response = await request(app)
            .post('/api/searchAreaResponseCount')
            .send(searchData);

        // Store the ID of the created search area response count
        createdSearchAreaResponseCountId = response.body._id;
    });

    test('It should get a search area response count by ID', async () => {
        // Make a GET request to fetch the search area response count by ID
        const response = await request(app)
            .get(`/api/searchAreaResponseCounts/${createdSearchAreaResponseCountId}`);

        // Assert the response status code and body
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', createdSearchAreaResponseCountId);
    });
});

describe('PUT /searchAreaResponseCounts/:id', () => {
    let createdSearchAreaResponseCountId;

    beforeAll(async () => {
        // Mock a search area response count
        const searchData = {
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000,
            included_types: ['restaurant'],
            excluded_types: ['bar'],
            response_count: 10
        };

        // Create a search area response count
        const response = await request(app)
            .post('/api/searchAreaResponseCount')
            .send(searchData);

        // Store the ID of the created search area response count
        createdSearchAreaResponseCountId = response.body._id;
    });

    test('It should update a search area response count by ID', async () => {
        // Mock update data
        const updateData = {
            response_count: 15
        };

        // Make a PUT request to update the search area response count by ID
        const response = await request(app)
            .put(`/api/searchAreaResponseCounts/${createdSearchAreaResponseCountId}`)
            .send(updateData);

        // Assert the response status code and body
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', createdSearchAreaResponseCountId);
        expect(response.body.response_count).toBe(updateData.response_count);
    });
});

describe('DELETE /searchAreaResponseCounts/:id', () => {
    let createdSearchAreaResponseCountId;

    beforeAll(async () => {
        // Mock a search area response count
        const searchData = {
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000,
            included_types: ['restaurant'],
            excluded_types: ['bar'],
            response_count: 10
        };

        // Create a search area response count
        const response = await request(app)
            .post('/api/searchAreaResponseCount')
            .send(searchData);

        // Store the ID of the created search area response count
        createdSearchAreaResponseCountId = response.body._id;
    });

    test('It should delete a search area response count by ID', async () => {
        // Make a DELETE request to delete the search area response count by ID
        const response = await request(app)
            .delete(`/api/searchAreaResponseCounts/${createdSearchAreaResponseCountId}`);

        // Assert the response status code and body
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'SearchAreaResponseCount deleted successfully');
    });
});

describe('GET /searchAreaResponseCounts', () => {
    test('It should get all search area response counts', async () => {
        // Make a GET request to fetch all search area response counts
        const response = await request(app)
            .get('/api/searchAreaResponseCounts');

        // Assert the response status code and body
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized. No Firebase token provided" });
    });
});
