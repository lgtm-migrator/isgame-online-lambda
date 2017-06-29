////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /games/secret_world_legends/index.js
///////////////////////////////////////

var request = require("request");
var cheerio = require("cheerio");
var gameStatus = require('../../models/gamestatus');

var config = require('../../config');
let configInstance = new config();

var realGameName = "secret world legends";

function CheckGameStatus(callback){

        request({uri: "http://msgs.ageofconan.com/patchnotes.php?UniverseName=SWLLive&Language=en"}, function(error, response, body) {
            if(error){
                callback(null);
            }
            
            try{
                
                var $ = cheerio.load(body);

                var point1 = $('font');
                var point2 = $('b');

                var holdStatusStringUnparsed = point1.children().eq(1).text();
                var holdMaintenanceStringUnparsed = point2.children().eq(1).text();

                var statusResponse = new gameStatus(holdStatusStringUnparsed, holdMaintenanceStringUnparsed, realGameName);

                if(configInstance.debugEnabled){
                     console.log("Hold Status: " + holdStatusStringUnparsed);
                     console.log("Maint Status: " + holdMaintenanceStringUnparsed);
                     console.log("Response Object" + statusResponse);
                }

                callback(statusResponse);
            }
            catch(errorUnhandled){
                throw errorUnhandled;
            }
        });        
}

module.exports = CheckGameStatus;