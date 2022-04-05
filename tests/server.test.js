const server = require('../server.js');
var request = require('supertest');

describe("api tests", () => {
    beforeAll(() => {
        process.env.DB_NAME = 'test';
    })

    it('GET /users should return all users and their friendship points', async () => {
        const res = await request(server)
          .get('/users')
          .set('Content-Type', 'application/json')
        
        resObj = JSON.parse(res.text);
        expect(res.status).toEqual(200);
    });

    // it('POST /activities should insert new activity', async () => {
    //     const res = await request(server)
    //         .post('/activities')
    //         .set('Content-Type', 'application/json')
    //         .send({
    //             id: 2,
    //             date: "2022-03-14",
    //             name: "Hiking",
    //             duration: 10,
    //             distance: 55.5,
    //         })
        
    //     resObj = JSON.parse(res.text);
    //     expect(res.status).toEqual(200);
    //     expect(resObj).toHaveProperty("id");
    //     expect(resObj).toHaveProperty("date");
    //     expect(resObj).toHaveProperty("name");
    //     expect(resObj).toHaveProperty("duration");
    //     expect(resObj).toHaveProperty("distance");
    // });

    // it('POST /activities with invalid id property should give 400 status', async () => {
    //     const res = await request(server)
    //         .post('/activities')
    //         .set('Content-Type', 'application/json')
    //         .send({
    //             date: "2022-03-14",
    //             name: "Hiking",
    //             duration: 10,
    //             distance: 55.5,
    //         })
        
    //     expect(res.status).toEqual(400);
    // });

    // it('POST /activities with invalid date property should give 400 status', async () => {
    //     const res = await request(server)
    //         .post('/activities')
    //         .set('Content-Type', 'application/json')
    //         .send({
    //             id: 2,
    //             date: 20220314,
    //             name: "Hiking",
    //             duration: 10,
    //             distance: 55.5,
    //         })
        
    //     expect(res.status).toEqual(400);
    // });

    // it('POST /activities with invalid name property should give 400 status', async () => {
    //     const res = await request(server)
    //         .post('/activities')
    //         .set('Content-Type', 'application/json')
    //         .send({
    //             id: 2,
    //             date: "2022-03-14",
    //             duration: 10,
    //             distance: 55.5,
    //         })
        
    //     expect(res.status).toEqual(400);
    // });

    // it('POST /activities with invalid duration property should give 400 status', async () => {
    //     const res = await request(server)
    //         .post('/activities')
    //         .set('Content-Type', 'application/json')
    //         .send({
    //             id: 2,
    //             date: "2022-03-14",
    //             name: "Hiking",
    //             duration: "10",
    //             distance: 55.5,
    //         })
        
    //     expect(res.status).toEqual(400);
    // });

    // it('POST /activities with invalid distance property should give 400 status', async () => {
    //     const res = await request(server)
    //         .post('/activities')
    //         .set('Content-Type', 'application/json')
    //         .send({
    //             id: 2,
    //             date: "2022-03-14",
    //             name: "Hiking",
    //             duration: 10,
    //             distance: "123fakenumber",
    //         })
        
    //     expect(res.status).toEqual(400);
    // });

    // it('PUT /activities should modify one activity', async () => {
    //     const res = await request(server)
    //         .put('/activities/2')
    //         .set('Content-Type', 'application/json')
    //         .send({
    //             date: "2022-05-14",
    //             name: "Adjustment",
    //             duration: 100,
    //             distance: 70.7,
    //         })

        
    //     resObj = JSON.parse(res.text);
        
    //     expect(res.status).toEqual(200);
    //     expect(resObj.modifiedCount).toEqual(1);
    // });

    // it('DELETE /activities should delete one activity', async () => {
    //     const res = await request(server)
    //       .delete('/activities/2')
    //       .set('Content-Type', 'application/json')
        
    //     expect(res.status).toEqual(200);
    // });
})