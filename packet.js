var mysql = require('mysql');

/** DB */
var DB_HOST = "localhost";
var DB_USER = "root";
var DB_PASS = "toor";
var DB_NAME = "museum_project";

/** General Field definitions */
var P_TYPE 	= 0;
var P_SUBTYPE	= 1;

/** Types */
var P_TYPE_AUTH  = "0";
var P_TYPE_TRACK = "1";

/** Authentication Fields */
var P_AUTH_PIN   = 2;
var P_AUTH_CODE  = 2;
var P_AUTH_GROUP = 3;

/** Track Fields */
var P_TRACK_ID 	 = 2;
var P_TRACK_URL  = 2;
var P_TRACK_DESC = 3;
var P_TRACK_LEN  = 4;

var P_DELIMITER = "%";

var connection = mysql.createConnection({
	host: 	  DB_HOST,
	user:	  DB_USER,
	password: DB_PASS,
	database: DB_NAME,
});

/** Connects to database and sets stuff up. */
exports.init = function() {
	connection.connect(function(err) {
		if(err) throw err;
	});
}

exports.handle = function(packet, socket) {
	console.log("Got a packet!");
	var response;
	
	console.log("Parsing: "+packet[P_TYPE]);

	switch(packet[P_TYPE]) {
		case P_TYPE_AUTH:
			response = handleAuthPacket(packet, socket);
			break;
		case P_TYPE_TRACK:
			response = handleTrackPacket(packet, socket);
			break; 
	}
}

/** Determines whether a PIN is currently valid or not */
function handleAuthPacket(packet, socket) {
	if(packet[P_AUTH_GROUP] == 1) {
		socket.emit('newGroupMember', {pin: packet[P_AUTH_PIN], state: 0});
		return;
	}

	connection.query("SELECT user_state FROM users WHERE user_pin_code = \'"+packet[P_AUTH_PIN]+"\'", function(err, rows) {
		if(err) throw err;
		
		if(rows[0] != null) {
			socket.send("0%1%"+rows[0].user_state);
			socket.emit('newUser', {pin: packet[P_AUTH_PIN], state: rows[0].user_state});
		}
		else { 
			/** user does not exist */
			socket.send("0%1%-1");
		}
	});
}

/** Returns the requested track details if it exists */
function handleTrackPacket(packet, socket) {
	connection.query("SELECT audio_file_link, audio_file_length FROM audio_file WHERE audio_file_id = \'"+packet[P_TRACK_ID]+"\'", function(err, rows) {
		if(err) throw err;

		if(rows[0] != null) {
			socket.send("1%1%"+rows[0].audio_file_link+
					"%"+rows[0].audio_file_name+
					"%"+rows[0].audio_file_length);
			console.log("got it");
		}
		else {
			socket.send("no.");
			console.log("not got it");
		}
	});
}
