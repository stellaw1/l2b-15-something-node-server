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
 * get chat history for 2 users
 *
 * @param string sender_id
 * @param string receiver_id
 * @return Array<{sender_id: sender_id, receiver_id: receiver_id, message: message, time: time}>
 */
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
  /*
   * post new chat message
   *
   * @param string sender_id
   * @param string receiver_id
   * @param string message
   * @return string "posted" on success and "" on failure
   */
  .post((req, res) => {
    let chat = req.body;

    if (chat) {
      db.postChat(chat)
        .then(results => {
          console.log(results);
          res.status(200).send("posted");
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
 * @return string "friends" if friends, "" otherwise
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

/*
 * Gets list of friends for a user
 *
 * @param string user_id
 * @return Array<string> of friends
 */
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
  /*
   * Post new friendship
   *
   * @param string user_id
   * @param string friend_id
   * @return string "posted" on success and "" on failure
   */
  .post((req, res) => {
    let friendship = req.body;

    if (friendship) {
      db.postFriendship(friendship)
        .then(results => {
          console.log(results);
          res.status(200).send("posted")
        }).catch(err => {
          console.log(err)
          res.sendStatus(400);
        });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  })
  /*
   * Delete a friendship
   *
   * @param string user_id
   * @param string friend_id
   * @return string "deleted" on success and "" on failure
   */
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

function checkWinner(sender_choice, receiver_choice) {
  switch (sender_choice) {
    case "rock":
      if (receiver_choice === "rock") {
        return "tie";
      } else if (receiver_choice === "paper") {
        return "loss";
      } else if (receiver_choice === "scissors") {
        return "win";
      } else {
        return "error";
      }
    case "paper":
      if (receiver_choice === "rock") {
        return "win";
      } else if (receiver_choice === "paper") {
        return "tie";
      } else if (receiver_choice === "scissors") {
        return "loss";
      } else {
        return "error";
      }
    case "scissors":
      if (receiver_choice === "rock") {
        return "loss";
      } else if (receiver_choice === "paper") {
        return "win";
      } else if (receiver_choice === "scissors") {
        return "tie";
      } else {
        return "error";
      }
    default:
      return "error";
  }
}

/*
 * Get game data
 *
 * @param string sender_id
 * @param string receiver_id
 * @return string "sender" or "receiver" indicating who won
 */
app.route("/game")
  .get((req, res) => {
    let data = req.query;

    if (data) {
      db.getGameData(data)
        .then(results => {
          if (results) {
            let gameRes;
            if (data.sender_id === results.sender_id) {
              gameRes = checkWinner(results.sender_choice, results.receiver_choice);
              if (gameRes === "win") {
                db.incrementFriendship(data.sender_id);
              }
            } else {
              gameRes = checkWinner(results.receiver_choice, results.sender_choice);
              if (gameRes === "win") {
                db.incrementFriendship(data.receiver_id);
              }
            }
            res.status(200).send(JSON.stringify(gameRes))
          }
        }).catch(err => {
          console.log(err)
          res.sendStatus(400);
        });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  })
  /*
  * Post game data
  *
  * @param string sender_id
  * @param string receiver_id
  * @param string choice
  * @return string "posted" on success and "" on failure
  */
  .post((req, res) => {
    let data = req.body;

    if (data) {
      db.enterGameData(data)
        .then(results => {
          console.log(results);
          res.status(200).send("posted")
        }).catch(err => {
          console.log(err)
          res.sendStatus(400);
        });
    } else {
      console.log('empty request body found');
      res.sendStatus(400);
    }
  })
  /*
  * Delete game data
  *
  * @param string sender_id
  * @param string receiver_id
  * @return string "deleted" on success and "" on failure
  */
  .delete((req, res) => {
    let data = req.query;

    if (data) {
      db.deleteGameData(data)
        .then(results => {
          console.log(results);
          if (results) {
            res.status(200).send(JSON.stringify(results.deletedCount));
          } else {
            res.sendStatus(400);
          }
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
