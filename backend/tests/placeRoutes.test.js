const request = require('supertest');
const app = require('../server'); 
const Place = require('../models/placeModel'); 

    describe('POST /placeNormal', () => {
        test('It should create a new place', async () => {
            // Mock the request body, (only sending in the required fields)
            const placeData = {
                id: "123456789",
                user_id: "user123",
                displayName: "Test Place",
                formattedAddress: "Test Address"
            };

            // Make a POST request to create a new place
            const response = await request(app)
                .post('/api/placeNormal')
                .send(placeData);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('_id');
        });
    });

    describe('GET /places/:id', () => {
        let createdPlaceId;

        beforeAll(async () => {
            // Mock a place
            const placeData = {
                id: "1234575646789",
                user_id: "user123",
                displayName: "Test Place",
                formattedAddress: "Test Address"
            };

            // Create a place
            const response = await request(app)
                .post('/api/placeNormal')
                .send(placeData);

            // Store the ID of the created place
            createdPlaceId = response.body.id;
        });

        test('It should return a place by ID if it exists', async () => {
            // Make a GET request to fetch the place by ID
            const response = await request(app)
                .get(`/api/places/${createdPlaceId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id', createdPlaceId);
        });
    });

    describe('GET /places', () => {
        test('It should get all places', async () => {
            // Make a GET request to fetch all places
            const response = await request(app)
                .get('/api/places');

            expect(response.statusCode).toBe(401); // Unauthorized access
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('PUT /places/:id', () => {
        let createdPlaceId;

        beforeAll(async () => {
            // Mock a place
            const placeData = {
                id: "123452346789",
                user_id: "user123",
                displayName: "Test Place",
                formattedAddress: "Test Address"
            };

            // Create a place
            const response = await request(app)
                .post('/api/placeNormal')
                .send(placeData);

            // Store the ID of the created place
            createdPlaceId = response.body.id;
        });

        test('It should update a place by ID', async () => {
            // Mock update data
            const updateData = {
                displayName:"Updated Test Place"
            };

            // Make a PUT request to update the place by ID
            const response = await request(app)
                .put(`/api/places/${createdPlaceId}`)
                .send(updateData);

            expect(response.statusCode).toBe(200); // Assuming place is found and updated
            expect(response.body).toHaveProperty('id', createdPlaceId);
            expect(response.body.displayName.text).toBe(updateData.displayName.text);
        });
    });

    describe('DELETE /places/:id', () => {
        let createdPlaceId;

        beforeAll(async () => {
            // Mock a place
            const placeData = {
                id: "12345764556789",
                user_id: "user123",
                displayName: "Test Place",
                formattedAddress: "Test Address"
            };

            // Create a place
            const response = await request(app)
                .post('/api/placeNormal')
                .send(placeData);

            // Store the ID of the created place
            createdPlaceId = response.body.id;
        });

        test('It should delete a place by ID', async () => {
            // Make a DELETE request to delete the place by ID
            const response = await request(app)
                .delete(`/api/places/${createdPlaceId}`);

            expect(response.statusCode).toBe(200); // Assuming place is found and deleted
            expect(response.body).toHaveProperty('id', createdPlaceId);
        });
    });

    describe('GET /places/by-user/:user_id', () => {
        test('It should return "No places found for user"', async () => {
            // Mock user ID
            const userId = "non_existing_user_id";

            // Make a GET request to fetch places by user ID
            const response = await request(app)
                .get(`/api/places/by-user/${userId}`);

            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({ error: "Unauthorized. No Firebase token provided" });
        });
    });
