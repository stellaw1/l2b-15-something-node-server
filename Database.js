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

Database.prototype.getUsers = function(){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			/* TODO: read the chatrooms from `db`
			 * and resolve an array of chatrooms */
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
				reject(new Error("invalid " + err + " property in given activity"));
			}

			// initialize friendship points to 0
			user["friendship_points"] = 0;

			console.log(user);

			const col = db.collection('users');
				col.insertOne(user, function(err, res){
					if(err){
						console.log(err);
					}
					resolve(user);
				});
		})
	)
}

module.exports = Database;