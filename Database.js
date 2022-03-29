const { MongoClient, AbstractCursor } = require('mongodb');	// require the mongodb driver

/**
 * Uses mongodb v3.6+ - [API Documentation](http://mongodb.github.io/node-mongodb-native/3.6/api/)
 * Database wraps a mongoDB connection to provide a higher-level abstraction layer
 * for manipulating the objects in our cpen322 app.
 */
function Database(mongoUrl, dbName){
	if (!(this instanceof Database)) return new Database(mongoUrl, dbName);
	this.connected = new Promise((resolve, reject) => {
		MongoClient.connect(
			mongoUrl,
			{
				useNewUrlParser: true
			},
			(err, client) => {
				if (err) reject(err);
				else {
					console.log('[MongoClient] Connected to ' + mongoUrl + '/' + dbName);
					resolve(client.db(dbName));
				}
			}
		)
	});
	this.status = () => this.connected.then(
		db => ({ error: null, url: mongoUrl, db: dbName }),
		err => ({ error: err })
	);
}

Database.prototype.getAllUsers = function(){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			const col = db.collection('users');
			col.find({}).toArray(function(err, items) {
					if (err) {
						reject(err);
					}

					resolve(items);
				});
		})
	)
}

Database.prototype.getUserByUsername = function(username){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			const col = db.collection('users');

			let query = username.username;

			col.findOne({username: query}, function(err, document) {
				if (err) {
					reject(err);
				}
				resolve(document);
			});
		})
	)
}

function isUserType(user) {
	if (!user.hasOwnProperty("username") || typeof(user["username"]) != "string") {
		return "username";
	}
	if (!user.hasOwnProperty("pet_colour") || typeof(user["pet_colour"]) != "string") {
		return "pet_colour";
	}
	return null;
}

Database.prototype.postUser = function(user){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {

			let err;
			if (err = isUserType(user)) {
				reject(new Error("invalid " + err + " property in given user"));
			}

			// initialize friendship points to 0
			user["friendship_points"] = 0;

			console.log(user);

			const col = db.collection('users');
			col.insertOne(user, function(err, res){
				if(err){
					console.log(err);
				}
				resolve(res);
			});
		})
	)
}

Database.prototype.incrementFriendship = function(username, activity){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			
			var query = { username: username.username };

			const col = db.collection('users');
			col.findOne(query, function(err, document) {
				if (document) {
					var oldPoints = document["friendship_points"];
					var newPoints = {friendship_points: oldPoints + 1}
					var newvalues = { $set: newPoints };
					col.updateOne(query, newvalues, function(err, res){
						if(err){
							console.log(err);
						}
						resolve(res);
					});
				} else {
					reject(new Error("no user with matching username found"));
				}
			});
		})
	)
}

function isUsersType(users) {
	if (!users.hasOwnProperty("sender_id") || typeof(users["sender_id"]) != "string") {
		return "sender_id";
	}
	if (!users.hasOwnProperty("receiver_id") || typeof(users["receiver_id"]) != "string") {
		return "receiver_id";
	}
	return null;
}

Database.prototype.getChatHistory = function(users){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {

			if (err = isUsersType(users)) {
				reject(new Error("invalid " + err + " property in given users"));
			}
			
			let query = {
				sender_id: users.sender_id,
				receiver_id: users.receiver_id
			};

			const col = db.collection('chatlog');
			col.find(query).toArray(function(err, items) {
					if (err) {
						reject(err);
					}
					resolve(items);
				});
		})
	)
}

function isChatType(chat) {
	if (err = isUsersType(chat)) {
		return err;
	}
	if (!chat.hasOwnProperty("message") || typeof(chat["message"]) != "string") {
		return "message";
	}
	return null;
}
Database.prototype.postChat = function(chat){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {

			if (err = isChatType(chat)) {
				reject(new Error("invalid " + err + " property in given chat object"));
			}
			
			let data = {
				sender_id: chat.sender_id,
				receiver_id: chat.receiver_id,
				message: chat.message,
				time: Date.now()
			};

			const col = db.collection('chatlog');
			col.insertOne(data, function(err, res){
				if(err){
					console.log(err);
				}
				resolve(res);
			});
		})
	)
}

module.exports = Database;