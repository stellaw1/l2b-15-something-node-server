const server = require('../server.js');
var request = require('supertest');

describe("api tests", () => {

    it('GET /users should return all users and their friendship points', async () => {
        const res = await request(server)
          .get('/users')
          .set('Content-Type', 'application/json')
        
        expect(res.status).toEqual(200);
        // resObj = JSON.parse(res.text);
        // expect(resObj.length).toEqual(3);
    });

    it('GET /user should return given user pet colour', async () => {
        const res = await request(server)
            .get('/user')
            .set('Content-Type', 'application/json')
            .query({
                username: "POO"
              })
        
        expect(res.status).toEqual(200);
        // resObj = JSON.parse(res.text);
        // expect(resObj).toEqual("1");
    });

    it('POST /user should not post new user', async () => {
        const res = await request(server)
            .post('/user')
            .set('Content-Type', 'application/json')
            .send({
                username: "POOP",
                pet_colour: "69"
            })
        
        expect(res.status).toEqual(200);
        // expect(res.text).toEqual("user already exists");
    });

    it('GET /chat should return latest chat', async () => {
        const res = await request(server)
            .get('/chat')
            .set('Content-Type', 'application/json')
            .query({
                sender_id: "POOP",
                receiver_id: "POO"
            })
        
        expect(res.status).toEqual(200);
    });

    it('POST /chat should post chat', async () => {
        const res = await request(server)
            .post('/chat')
            .set('Content-Type', 'application/json')
            .send({
                sender_id: "POOP",
                receiver_id: "POO",
                message: "POOP to POO"
            })
        
        expect(res.status).toEqual(200);
    });

    it('GET /isFriends should return friend status', async () => {
        const res = await request(server)
            .get('/isFriends')
            .set('Content-Type', 'application/json')
            .query({
                user_id: "POOP",
                friend_id: "POO"
            })
        
        expect(res.status).toEqual(200);
    });

    it('POST /friendship should make friendship', async () => {
        const res = await request(server)
            .post('/friendship')
            .set('Content-Type', 'application/json')
            .send({
                user_id: "POOP",
                friend_id: "POO"
            })
        
        expect(res.status).toEqual(200);
    });

    it('DELETE /friendship should make friendship', async () => {
        const res = await request(server)
            .delete('/friendship')
            .set('Content-Type', 'application/json')
            .query({
                user_id: "POOP",
                friend_id: "POO"
            })
        
        expect(res.status).toEqual(200);
    });

    it('GET /game get ongoing game', async () => {
        const res = await request(server)
            .get('/game')
            .set('Content-Type', 'application/json')
            .query({
                sender_id: "POOP",
                receiver_id: "POO"
            })
        
        expect(res.status).toEqual(200);
    });

    it('POST /game starts a new game', async () => {
        const res = await request(server)
            .post('/game')
            .set('Content-Type', 'application/json')
            .send({
                sender_id: "POOP",
                receiver_id: "POO",
                choice: "Paper"
            })
        
        expect(res.status).toEqual(200);
    });

    // it('DELETE /game deletes ongoing game', async () => {
    //     const res = await request(server)
    //         .delete('/game')
    //         .set('Content-Type', 'application/json')
    //         .query({
    //             user_id: "POOP",
    //             friend_id: "POO"
    //         })
        
    //     expect(res.status).toEqual(200);
    // });

    it('GET /weather gets current weather', async () => {
        const res = await request(server)
            .get('/weather')
            .set('Content-Type', 'application/json')
        
        expect(res.status).toEqual(200);
    });
})