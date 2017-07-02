////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /games/playstation/index.js
///////////////////////////////////////

var request = require("request");
var cheerio = require("cheerio");
var gameStatus = require('../../models/gamestatus');

var config = require('../../config');
let configInstance = new config();

var realGameName = "eve online";

function CheckGameStatus(callback){

        request({uri: "https://launcher.eveonline.com/sync.json"}, function(error, response, body) {
            if(error){
                callback(null);
            }
            
            try{
                
                var point1 = JSON.parse(body);

                var holdStatusStringUnparsed = point1.tq.serverStatus;

                if(holdStatusStringUnparsed === "online" ){
                    holdStatusStringUnparsed = "Online"; //fixup to online for return matchin.
                }
                else if(holdStatusStringUnparsed === "offline"){
                    holdStatusStringUnparsed = "Offline";
                }
                else
                {
                    holdStatusStringUnparsed = "ServiceNote";
                }
                var statusResponse = new gameStatus(holdStatusStringUnparsed, null, realGameName);

                if(configInstance.debugEnabled){
                     console.log("Hold Status: " + holdStatusStringUnparsed);
                     //console.log("Maint Status: " + holdMaintenanceStringUnparsed);
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