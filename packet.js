var mysql = require('mysql');

/** DB */
var DB_HOST = "localhost";
var DB_USER = "root";
var DB_PASS = "toor";
var DB_NAME = " ";

/** General Field definitions */
var P_TYPE 	= 0;
var P_SUBTYPE	= 1;

/** Types */
var P_TYPE_AUTH  = "0";
var P_TYPE_TRACK = "1";

/** Authentication Fields */
var P_AUTH_PIN 	= 2;
var P_AUTH_CODE = 2;

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

exports.handle = function(packet) {
	console.log("Got a packet!");
	var response;
	
	console.log("Parsing: "+packet[P_TYPE]);

	switch(packet[P_TYPE]) {
		case P_TYPE_AUTH:
			response = handleAuthPacket(packet);
			break;
		case P_TYPE_TRACK:
			response = handleTrackPacket(packet);
			break; 
	}
	console.log("Sending: " + response);
	return response;
}

function handleAuthPacket(packet) {
	if(packet[P_AUTH_PIN] != "1234")
		return "0%1%-1";

	return "0%1%0";	
}

function handleTrackPacket(packet) {
	return "1%1%http://test.com/track.mp3%This is the test mp3.%3600";
}
