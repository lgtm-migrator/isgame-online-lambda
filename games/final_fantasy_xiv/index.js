////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /games/template_game/index.js
///////////////////////////////////////

var request = require("request");
var gameStatus = require('../../models/gamestatus');

var config = require('../../config');
let configInstance = new config();

var realGameName = "final fantasy fourteen";

function CheckGameStatus(callback){




        request({uri: "http://frontier.ffxiv.com/worldStatus/login_status.json"}, function(error, response, body) {
            if(error){
                callback(null);
            }
            
            try{
                
                var point1 = JSON.parse(body);
                
                var holdStatusStringUnparsed = point1.status;
                
                if(holdStatusStringUnparsed==1){
                    holdStatusStringUnparsed="Online";
                }
                else{
                    holdStatusStringUnparsed="Offline";
                }

                var statusResponse = new gameStatus(holdStatusStringUnparsed, null, realGameName);

                if(configInstance.debugEnabled){
                     console.log("Hold Status: " + holdStatusStringUnparsed);
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