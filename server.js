const express = require("express");
const Database = require('./Database.js');

var db = Database("mongodb+srv://admin:spycatadmin@cluster0.p2llx.mongodb.net/database?retryWrites=true&w=majority", "database");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded());


app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/users", (req, res) => {
  console.log("GET /users");
  db.getUsers()
    .then(results => {
      console.log(results);
      res.status(200).send(JSON.stringify(results));
    });
});

// app.post("/activities", (req, res) => {
//   console.log("Add record!");
//   let activity = req.body;

//   if (activity) {
//     db.postActivity(activity)
//       .then(results => {
//         console.log(results);
//         res.status(200).send(JSON.stringify(results))
//       }).catch(err => {
//         res.status(400).send(JSON.stringify(err))
//       });
//   } else {
//     res.status(400).send('empty request body found')
//   }
// });

// app.put("/activities/:id", (req, res) => {
//   console.log("Activity changed!");
//   let id = parseInt(req.params.id);
//   let activity = req.body;

//   if (activity && id) {
//     db.putActivity(id, activity)
//       .then(results => {
//         console.log(results);
//         res.status(200).send(JSON.stringify(results))
//       });
//   } else {
//     res.status(400).send('empty request body or param found')
//   }
// });

// app.delete("/activities/:id", (req, res) => {
//   console.log("Activity deleted!");
//   let id = parseInt(req.params.id);

//   if (id) {
//     db.deleteActivity(id)
//       .then(results => {
//         console.log(results);
//         res.status(200).send(JSON.stringify(results))
//       });
//   } else {
//     res.status(400).send('empty param found')
//   }
// });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
