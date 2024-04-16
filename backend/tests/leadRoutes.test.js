const request = require('supertest');
const app = require('../server'); 
const Lead = require('../models/leadModel'); 


describe('POST /lead', () => {
    test('It should create a new lead', async () => {
      // Mock the request body, (only sending in the required fields)
      const leadData = {
        user_id: "768945910",
        placeId: "ABC123"
      };
  
      // Make a POST request to create a new lead
      const response = await request(app)
        .post('/api/lead')
        .send(leadData);
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('_id');
    });
  });
  
  describe('POST /leads', () => {
      test('It should create multiple leads', async () => {
        // Mock the request body, (only sending in the required fields)
        const leadData = [
          {
            user_id: "1123242345678911",
            placeId: "ABC123"
          },
          {
            user_id: "765454232121212",
            placeId: "GHJ323"
          },
        ];
    
        // Make a POST request to create multiple leads
        const response = await request(app)
          .post('/api/leads')
          .send(leadData);
    
        expect(response.statusCode).toBe(201);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(leadData.length);
      });
    });

describe('GET /leads/:id', () => {
    let createdLeadId;
  
    beforeAll(async () => {
      // Mock lead data
      const leadData = {
        user_id: '123456789',
        placeId: 'ABC123'
      };
  
      // Make a POST request to create a new lead
      const response = await request(app)
        .post('/api/lead')
        .send(leadData);
  
      // Store the ID of the created lead
      createdLeadId = response.body._id;
    });
  
    test('It should return a lead by ID if it exists', async () => {
      // Make a GET request to fetch the lead by ID
      const response = await request(app)
        .get(`/api/leads/${createdLeadId}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id', createdLeadId);
    });
  });
    
    describe('GET /leads', () => {
      test('It should get all leads', async () => {
        // Make a GET request to fetch all leads
        const response = await request(app)
          .get('/api/leads');
    
        expect(response.statusCode).toBe(401); // Unauthorized access
        expect(response.body).toHaveProperty('error');
      });
    });
    
    describe('DELETE /leads/:id', () => {
        let createdLeadId;
      
        beforeAll(async () => {
          // Mock a lead
          const leadData = {
            user_id: "1234561231789",
            placeId: "ABC123"
          };
      
          // Create a lead
          const response = await request(app)
            .post('/api/lead')
            .send(leadData);
      
          // Store the ID of the created lead
          createdLeadId = response.body._id;
        });
      
        test('It should delete a lead by ID', async () => {
          // Make a DELETE request to delete the lead by ID
          const response = await request(app)
            .delete(`/api/leads/${createdLeadId}`);
      
          expect(response.statusCode).toBe(200); // Assuming lead is found and deleted
          expect(response.body).toHaveProperty('_id', createdLeadId);
        });
      });

    describe('GET /leads/by-user/:user_id', () => {
        test('It should return "Unauthorized. No Firebase token provided"', async () => {
          // Mock user ID
          const userId = "non_existing_user_id";
      
          // Make a GET request to fetch leads by user ID
          const response = await request(app)
            .get(`/api/leads/by-user/${userId}`);
      
          expect(response.statusCode).toBe(401);
          expect(response.body).toEqual({ error: "Unauthorized. No Firebase token provided" });
        });
    });
    
    describe('PUT /leads/:id', () => {
        let createdLeadId;
      
        beforeAll(async () => {
          // Mock a lead
          const leadData = {
            user_id: "123456712qw31289",
            placeId: "ABC123"
          };
      
          // Create a lead
          const response = await request(app)
            .post('/api/lead')
            .send(leadData);
      
          // Store the ID of the created lead
          createdLeadId = response.body._id;
        });
      
        test('It should update a lead by ID', async () => {
          // Mock update data
          const updateData = {
            placeId: "XYZ789"
          };
      
          // Make a PUT request to update the lead by ID
          const response = await request(app)
            .put(`/api/leads/${createdLeadId}`)
            .send(updateData);
      
          expect(response.statusCode).toBe(200); // Assuming lead is found and updated
          expect(response.body).toHaveProperty('_id', createdLeadId);
        });
      });
      