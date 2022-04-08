const server = require('../server.js');
var request = require('supertest');

describe("api tests", () => {

    it('POST /user should post new user', async () => {
        const res = await request(server)
            .post('/user')
            .set('Content-Type', 'application/json')
            .send({
                username: "USER2",
                pet_colour: "8"
            })
        
        expect(res.status).toEqual(200);
        expect(res.text).toEqual("posted");
    });

    it('GET /user should return given user pet colour', async () => {
        const res = await request(server)
            .get('/user')
            .set('Content-Type', 'application/json')
            .query({
                username: "USER2"
              })
        
        expect(res.status).toEqual(200);
        resObj = JSON.parse(res.text);
        expect(resObj).toEqual(8);
    });

    it('GET /user should return given user pet colour', async () => {
        const res = await request(server)
            .get('/user')
            .set('Content-Type', 'application/json')
            .query({
                username: "USER2"
              })
        
        expect(res.status).toEqual(200);
        resObj = JSON.parse(res.text);
        expect(resObj).toEqual(8);
    });

    it('GET /users should return all users and their friendship points', async () => {
        console.log(process.env.DB_NAME);
        const res = await request(server)
          .get('/users')
          .set('Content-Type', 'application/json')
        
        expect(res.status).toEqual(200);
        resObj = JSON.parse(res.text);
        expect(resObj.length).toEqual(2);
    });

    it('POST /friendship should make friendship', async () => {
        const res = await request(server)
            .post('/friendship')
            .set('Content-Type', 'application/json')
            .send({
                user_id: "USER1",
                friend_id: "USER2"
            })
        
        expect(res.status).toEqual(200);
    });

    it('GET /isFriends should return friend status', async () => {
        const res = await request(server)
            .get('/isFriends')
            .set('Content-Type', 'application/json')
            .query({
                user_id: "USER1",
                friend_id: "USER2"
            })
        
        expect(res.status).toEqual(200);
    });

    it('DELETE /friendship should make friendship', async () => {
        const res = await request(server)
            .delete('/friendship')
            .set('Content-Type', 'application/json')
            .query({
                user_id: "USER1",
                friend_id: "USER2"
            })
        
        expect(res.status).toEqual(200);
    });

    it('POST /chat should post chat', async () => {
        const res = await request(server)
            .post('/chat')
            .set('Content-Type', 'application/json')
            .send({
                sender_id: "USER1",
                receiver_id: "USER2",
                message: "message from USER1 to USER2"
            })
        
        expect(res.status).toEqual(200);
    });

    it('GET /chat should return latest chat', async () => {
        const res = await request(server)
            .get('/chat')
            .set('Content-Type', 'application/json')
            .query({
                sender_id: "USER1",
                receiver_id: "USER2"
            })
        
        expect(res.status).toEqual(200);
        resObj = JSON.parse(res.text);
        expect(resObj).toEqual("message from USER1 to USER2");
    });

    it('POST /game starts a new game', async () => {
        const res = await request(server)
            .post('/game')
            .set('Content-Type', 'application/json')
            .send({
                sender_id: "USER1",
                receiver_id: "USER2",
                choice: "PAPER"
            })
        
        expect(res.status).toEqual(200);
    });

    it('POST /game updates existing game', async () => {
        const res = await request(server)
            .post('/game')
            .set('Content-Type', 'application/json')
            .send({
                sender_id: "USER2",
                receiver_id: "USER1",
                choice: "ROCK"
            })
        
        expect(res.status).toEqual(200);
    });

    it('GET /game get ongoing game for USER1', async () => {
        const res = await request(server)
            .get('/game')
            .set('Content-Type', 'application/json')
            .query({
                sender_id: "USER1",
                receiver_id: "USER2"
            })
        
        expect(res.status).toEqual(200);
        resObj = JSON.parse(res.text);
        expect(resObj).toEqual("WIN");
    });

    it('GET /game get ongoing game for USER2', async () => {
        const res = await request(server)
            .get('/game')
            .set('Content-Type', 'application/json')
            .query({
                sender_id: "USER2",
                receiver_id: "USER1"
            })
        
        expect(res.status).toEqual(200);
        resObj = JSON.parse(res.text);
        expect(resObj).toEqual("LOSS");
    });

    it('DELETE /game deletes ongoing game', async () => {
        const res = await request(server)
            .delete('/game')
            .set('Content-Type', 'application/json')
            .query({
                sender_id: "USER1",
                receiver_id: "USER2"
            })
        
        expect(res.status).toEqual(200);
    });

    it('GET /weather gets current weather', async () => {
        const res = await request(server)
            .get('/weather')
            .set('Content-Type', 'application/json')
        
        expect(res.status).toEqual(200);
    });
})