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

Database.prototype.getFriendsForUser = function(user){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			
			if (!user.hasOwnProperty("user_id") || typeof(user["user_id"]) != "string") {
				reject(new Error("invalid username property in given user object"));
			}

			var query = { user_id: user.user_id };
			
			const col = db.collection('friendships');
			col.find(query).toArray(function(err, items) {
				if (err) {
					reject(err);
				}
				resolve(items);
			});
		})
	)
}

function isFriendshipType(friendship) {
	if (!friendship.hasOwnProperty("user_id") || typeof(friendship["user_id"]) != "string") {
		return "user_id";
	}
	if (!friendship.hasOwnProperty("friend_id") || typeof(friendship["friend_id"]) != "string") {
		return "friend_id";
	}
	return null;
}

Database.prototype.postFriendship = function(friendship){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {

			if (err = isFriendshipType(friendship)) {
				reject(new Error("invalid " + err + " property in given friendship object"));
			}
			
			let data = {
				user_id: friendship.user_id,
				friend_id: friendship.friend_id
			};

			const col = db.collection('friendships');
			col.insertOne(data, function(err, res){
				if(err){
					console.log(err);
				}
				resolve(res);
			});
		})
	)
}

Database.prototype.deleteFriendship = function(friendship){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			if (err = isFriendshipType(friendship)) {
				reject(new Error("invalid " + err + " property in given friendship object"));
			}

			var myquery = { 
				user_id: friendship.user_id,
				friend_id: friendship.friend_id
			};

			const col = db.collection('friendships');
			col.deleteOne(myquery, function(err, res){
					if(err){
						console.log(err);
					}
					resolve(res);
				});
		})
	)
}

function isGameType(game) {
	if (!game.hasOwnProperty("sender_id") || typeof(game["sender_id"]) != "string") {
		return "sender_id";
	}
	if (!game.hasOwnProperty("receiver_id") || typeof(game["receiver_id"]) != "string") {
		return "receiver_id";
	}
	return null;
}

Database.prototype.getGameData = function(data){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			if (err = isGameType(data)) {
				reject(new Error("invalid " + err + " property in given data object"));
			}

			var query1 = {
				sender_id: data.sender_id,
				receiver_id: data.receiver_id
			};

			var query2 = {
				sender_id: data.receiver_id,
				receiver_id: data.sender_id
			};

			var query = { $or: [ query1, query2 ] }

			const col = db.collection('game');
			col.findOne(query, function(err, document) {
				if (err) {
					reject(err);
				}
				resolve(document);
			});
		})
	)
}

Database.prototype.enterGameData = function(data){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			if (err = isGameType(data)) {
				reject(new Error("invalid " + err + " property in given data object"));
			}


			var query = {
				sender_id: data.receiver_id,
				receiver_id: data.sender_id
			};

			const col = db.collection('game');
			col.findOne(query, function(err, document) {
				if (document) {
					if (!data.hasOwnProperty("choice") || typeof(data["choice"]) != "string") {
						reject(new Error("invalid choice property in given data object"));
					}

					let val = { receiver_choice: data.choice };
					let newvalues = { $set: val };

					col.updateOne(query, newvalues, function(err, res){
						if(err){
							console.log(err);
						}
						resolve(res);
					});
				} else {
					if (!data.hasOwnProperty("choice") || typeof(data["choice"]) != "string") {
						reject(new Error("invalid choice property in given data object"));
					}
					var newdata = {
						sender_id: data.sender_id,
						receiver_id: data.receiver_id,
						sender_choice: data.choice
					};
					
					col.insertOne(newdata, function(err, res){
						if(err){
							console.log(err);
						}
						resolve(res);
					});
				}
			});
		})
	)
}

Database.prototype.deleteGameData = function(data){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			if (err = isFriendshipType(data)) {
				reject(new Error("invalid " + err + " property in given data object"));
			}

			var query1 = {
				sender_id: data.receiver_id,
				receiver_id: data.sender_id
			};
			
			var query2 = {
				sender_id: data.sender_id,
				receiver_id: data.receiver_id
			};
			
			const col = db.collection('game');
			col.deleteOne(query1, function(err, document) {
				console.log(document)
				console.log(document.deletedCount)
				if (document.deletedCount > 0) {
					resolve(document)
				} else {
					col.deleteOne(query2, function(err, document) {
						if (err) {
							reject(err);
						} 
						resolve(document)
					});
				}
			});
			
		})
	)
}

module.exports = Database;