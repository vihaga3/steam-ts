module.exports = function(config, callback) {
    //  Only use teamspeakClient in keepalive.js, so we replace the already existing client when TeamSpeak goes down.

    var async = require('async'),
        TeamSpeakClient = require("node-teamspeak"),
        util = require("util");


    async.waterfall([
        function (callback) {
            console.log("Trying to connect to the TeamSpeak server...");

            var teamspeakClient = new TeamSpeakClient(config.ts_ip, config.q_port);

            teamspeakClient.send("login", {client_login_name: config.q_username, client_login_password: config.q_password}, function (err) {
                if (typeof err !== "undefined") {
                    callback(err);
                } else {
                    callback(null, teamspeakClient)
                }
            });
        },
        // Combined server selection & bot nickname into one command as from build 1536564584 this appears to be required
        // Should solve { id: 513, msg: 'nickname is already in use' } referencing bot's own name
        function (teamspeakClient, callback) {
            console.log("Logged into the query with credentials.");
            teamspeakClient.send("use", {sid: config.q_vserverid, client_nickname: config.bot_nickname}, function (err) {
                if (typeof err !== "undefined") {
                    callback(err);
                } else {
                    console.log(`Bot connect as: ${config.bot_nickname}`);
                    callback(null, teamspeakClient);
                }
            })
        },
    ],

    function (err, results) {
        //  results = teamspeakClient

        if (err != null) {
            callback(err);
        } else {
            callback(null, results);
        }
    });
};