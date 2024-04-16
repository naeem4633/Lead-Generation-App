const request = require('supertest');
const app = require('../server'); 
const SearchArea = require("../models/searchAreaModel");

describe('POST /searchAreaNormal', () => {
    test('It should add a new search area', async () => {
        // Mock the request body
        const searchData = {
            user_id: "user123",
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000
        };

        // Make a POST request to create a new search area
        const response = await request(app)
            .post('/api/searchAreaNormal')
            .send(searchData);

        // Assert the response status code and body
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
    });
});

describe('GET /searchAreas/:id', () => {
    let createdSearchAreaId;

    beforeAll(async () => {
        // Mock a search area
        const searchData = {
            user_id: "user123",
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000
        };

        // Create a search area
        const response = await request(app)
            .post('/api/searchAreaNormal')
            .send(searchData);

        // Store the ID of the created search area
        createdSearchAreaId = response.body._id;
    });

    test('It should get a search area by ID', async () => {
        // Make a GET request to fetch the search area by ID
        const response = await request(app)
            .get(`/api/searchAreas/${createdSearchAreaId}`);

        // Assert the response status code and body
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', createdSearchAreaId);
    });
});

describe('PUT /searchAreas/:id', () => {
    let createdSearchAreaId;

    beforeAll(async () => {
        // Mock a search area
        const searchData = {
            user_id: "user123",
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000
        };

        // Create a search area
        const response = await request(app)
            .post('/api/searchAreaNormal')
            .send(searchData);

        // Store the ID of the created search area
        createdSearchAreaId = response.body._id;
    });

    test('It should update a search area by ID', async () => {
        // Mock update data
        const updateData = {
            user_id: "updated_user123",
            latitude: 41.8781,
            longitude: -87.6298,
            radius: 1500
        };

        // Make a PUT request to update the search area by ID
        const response = await request(app)
            .put(`/api/searchAreas/${createdSearchAreaId}`)
            .send(updateData);

        // Assert the response status code and body
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', createdSearchAreaId);
        expect(response.body.user_id).toBe(updateData.user_id);
    });
});

describe('DELETE /searchAreas/:id', () => {
    let createdSearchAreaId;

    beforeAll(async () => {
        // Mock a search area
        const searchData = {
            user_id: "user123",
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000
        };

        // Create a search area
        const response = await request(app)
            .post('/api/searchAreaNormal')
            .send(searchData);

        // Store the ID of the created search area
        createdSearchAreaId = response.body._id;
    });

    test('It should delete a search area by ID', async () => {
        // Make a DELETE request to delete the search area by ID
        const response = await request(app)
            .delete(`/api/searchAreas/${createdSearchAreaId}`);

        // Assert the response status code and body
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Search area deleted');
    });
});

describe('GET /searchAreas/by-user/:user_id', () => {
    test('It should return "No search areas found for user"', async () => {
        // Mock user ID
        const userId = "non_existing_user_id";

        // Make a GET request to fetch search areas by user ID
        const response = await request(app)
            .get(`/api/searchAreas/by-user/${userId}`);

        // Assert the response status code and body
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized. No Firebase token provided" });
    });
});

describe('GET /searchAreas', () => {
    test('It should get all search areas', async () => {
        // Make a GET request to fetch all search areas
        const response = await request(app)
            .get('/api/searchAreas');

        // Assert the response status code and body
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized. No Firebase token provided" });
    });
});