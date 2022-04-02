const express = require("express");
const Database = require('./Database.js');

var db = Database("mongodb+srv://admin:spycatadmin@cluster0.p2llx.mongodb.net/database?retryWrites=true&w=majority", "database");

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded());


/*
 * get list of all users and their friendship points
 *
 * @return Array<{string username, int friendship_points}>
 */
app.route("/users")
  .get((req, res) => {
    db.getAllUsers()
      .then(results => {
        console.log(results);
        res.status(200).send(JSON.stringify(results));
      });
  });


  /*
   * get pet colour for one user
   *
   * @param string username
   * @return int pet_colour
   */
app.route("/user")
  .get((req, res) => {
    let username = req.query;

    if (username) {
    db.getColourByUsername(username)
      .then(results => {
        console.log(results);
        if (results && results.hasOwnProperty("pet_colour")) {
          res.status(200).send(JSON.stringify(results.pet_colour));
        } else {
          console.log("user not found");
          res.sendStatus(400);
        }
      }).catch(err => {
        console.log(err);
        res.sendStatus(400);
      });;
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  })
  /*
   * post new user
   *
   * @param {string username, int pet_colour}
   * @return string "posted" on success and "" on failure
   */
  .post((req, res) => {
    let user = req.body;
    console.log(req);

    if (user) {
      db.postUser(user)
        .then(results => {
          console.log(results);
          res.sendStatus(200).send("posted");
        }).catch(err => {
          res.sendStatus(400);
        });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  });

/*
 * increment user friendship_points by 1
 *
 * @param string username
 * @return int 1 if user modified, 0 if nothing changed
 */
app.route("/increment")
  .post((req, res) => {
    let user = req.body;

    if (user) {
      db.incrementFriendship(user)
        .then(results => {
          console.log(results);
          res.status(200).send(JSON.stringify(results.modifiedCount));
        }).catch(err => {
          console.log(err)
          res.sendStatus(400);
        });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  });

app.route("/chat")
  .get((req, res) => {
    let users = req.query;

    if (users) {
    db.getChatHistory(users)
      .then(results => {
        console.log(results);
        res.status(200).send(JSON.stringify(results));
      });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
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
          console.log(err)
          res.sendStatus(400);
        });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  });

/*
 * Checks whether friend_id is a friend of user_id
 *
 * @param string user_id
 * @param string friend_id
 * @return 
 */
app.route('/isFriends')
  .get((req, res) => {
    let data = req.query;

    if (data) {
      db.getIsFriends(data)
        .then(results => {
          console.log(results);
          res.status(200).send(JSON.stringify(results));
        });
    } else {
      console.log('empty query body found');
      res.sendStatus(400);
    }
  })

app.route("/friendship")
  .get((req, res) => {
    let user = req.query;

    if (user) {
    db.getFriendsForUser(user)
      .then(results => {
        console.log(results);
        res.status(200).send(JSON.stringify(results));
      });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  })
  .post((req, res) => {
    let friendship = req.body;

    if (friendship) {
      db.postFriendship(friendship)
        .then(results => {
          console.log(results);
          res.status(200).send(JSON.stringify(results))
        }).catch(err => {
          console.log(err)
          res.sendStatus(400);
        });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  })
  .delete((req, res) => {
    let friendship = req.query;

    if (friendship) {
      db.deleteFriendship(friendship)
        .then(results => {
          console.log(results);
          res.status(200).send(JSON.stringify(results))
        }).catch(err => {
          console.log(err)
          res.sendStatus(400);
        });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  });
  
app.route("/game")
  .get((req, res) => {
    let data = req.query;

    if (data) {
      db.getGameData(data)
        .then(results => {
          console.log(results);
          res.status(200).send(JSON.stringify(results))
        }).catch(err => {
          console.log(err)
          res.sendStatus(400);
        });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  })
  .post((req, res) => {
    let data = req.body;

    if (data) {
      db.enterGameData(data)
        .then(results => {
          console.log(results);
          res.status(200).send(JSON.stringify(results))
        }).catch(err => {
          console.log(err)
          res.sendStatus(400);
        });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  })
  .delete((req, res) => {
    let data = req.query;

    if (data) {
      db.deleteGameData(data)
        .then(results => {
          console.log(results);
          res.status(200).send(JSON.stringify(results))
        }).catch(err => {
          console.log(err)
          res.sendStatus(400);
        });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
