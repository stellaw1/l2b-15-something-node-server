const express = require("express");
const Database = require('./Database.js');
const OpenWeatherMapHelper = require("openweathermap-node");

const db = Database("mongodb+srv://admin:spycatadmin@cluster0.p2llx.mongodb.net/database?retryWrites=true&w=majority", "database");
const weatherHelper = new OpenWeatherMapHelper(
	{
		APPID: '9e12875a014e100a631a56a3b16f74c9',
		units: "metric",
		lang: "en"
	}
);


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
          res.status(200).send("posted");
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
    case "ROCK":
      if (receiver_choice === "ROCK") {
        return "TIE";
      } else if (receiver_choice === "PAPER") {
        return "LOSS";
      } else if (receiver_choice === "SCISSORS") {
        return "WIN";
      } else {
        return "ERROR";
      }
    case "PAPER":
      if (receiver_choice === "ROCK") {
        return "WIN";
      } else if (receiver_choice === "PAPER") {
        return "TIE";
      } else if (receiver_choice === "SCISSORS") {
        return "LOSS";
      } else {
        return "ERROR";
      }
    case "SCISSORS":
      if (receiver_choice === "ROCK") {
        return "LOSS";
      } else if (receiver_choice === "PAPER") {
        return "WIN";
      } else if (receiver_choice === "SCISSORS") {
        return "TIE";
      } else {
        return "ERROR";
      }
    default:
      return "ERROR";
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
            } else {
              gameRes = checkWinner(results.receiver_choice, results.sender_choice);
            }

            // increment friendship points according to game results
            if (gameRes === "win") {
              console.log("incrementing ", data.sender_id);
              db.incrementFriendship(data.sender_id);
            } else if (gameRes === "loss") {
              console.log("incrementing ", data.receiver_id);
              db.incrementFriendship(data.receiver_id);
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


/*
 * Get weather
 *
 * @return string "posted" on success and "" on failure
 */
app.route("/weather")
.get((req, res) => {
  weatherHelper.getCurrentWeatherByCityName("Vancouver", (err, currentWeather) => {
    if(err){
      res.sendStatus(400);
    }
    else{
      var data;
      try {
        data = String(currentWeather.weather[0].main) + ", " + String(Math.round(currentWeather.main.temp));
      } catch (e) {
        data = "Sunny, 20"
      }
      res.status(200).send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
