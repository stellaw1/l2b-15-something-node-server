const express = require("express");
const Database = require('./Database.js');

var db = Database("mongodb+srv://admin:spycatadmin@cluster0.p2llx.mongodb.net/database?retryWrites=true&w=majority", "database");

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded());


app.route("/users")
  .get((req, res) => {
    db.getAllUsers()
      .then(results => {
        console.log(results);
        res.status(200).send(JSON.stringify(results));
      });
  });

app.route("/user")
  .get((req, res) => {
    let username = req.body;

    if (username) {
    db.getUserByUsername(username)
      .then(results => {
        console.log(results);
        res.status(200).send(JSON.stringify(results));
      });
    } else {
      res.status(400).send('empty request body found')
    }
  })
  .post((req, res) => {
    let user = req.body;
    console.log(req);

    if (user) {
      db.postUser(user)
        .then(results => {
          console.log(results);
          res.status(200).send(JSON.stringify(results))
        }).catch(err => {
          res.status(400).send(JSON.stringify(err))
        });
    } else {
      res.status(400).send('empty request body found')
    }
  });

app.route("/increment")
  .post((req, res) => {
    let user = req.body;

    if (user) {
      db.incrementFriendship(user)
        .then(results => {
          console.log(results);
          res.status(200).send(JSON.stringify(results))
        }).catch(err => {
          res.status(400).send(JSON.stringify(err))
        });
    } else {
      res.status(400).send('empty request body found')
    }
  });

app.route("/chat")
  .get((req, res) => {
    let users = req.body;

    if (users) {
    db.getChatHistory(users)
      .then(results => {
        console.log(results);
        res.status(200).send(JSON.stringify(results));
      });
    } else {
      res.status(400).send('empty request body found')
    }
  })
  .post((req, res) => {
    let chat = req.body;

    if (chat) {
      db.postChat(chat)
        .then(results => {
          console.log(results);
          res.status(200).send(JSON.stringify(results))
        }).catch(err => {
          res.status(400).send(JSON.stringify(err))
        });
    } else {
      res.status(400).send('empty request body found')
    }
  });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
