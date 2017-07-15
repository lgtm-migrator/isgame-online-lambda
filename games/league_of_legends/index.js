////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /games/template_game/index.js
///////////////////////////////////////

var request = require("request");
var cheerio = require("cheerio");
var gameStatus = require('../../models/gamestatus');

var config = require('../../config');
let configInstance = new config();

var realGameName = "league of legends";

function CheckGameStatus(callback){




        request({uri: "http://status.leagueoflegends.com/shards/na"}, function(error, response, body) {
            if(error){
                callback(null);
            }
            
            try{
                
                var point1 = JSON.parse(body);
                
                var holdStatusStringUnparsed = "Offline";
                
                //enter for
                var keys = Object.keys(point1.services);

                for(var i =0, length = keys.length; i<length; i++){

                    if(point1.services[keys[i]].slug == "game"){
                
                        if(point1.services[keys[i]].status=="online"){
                            holdStatusStringUnparsed="Online";
                        }
                        else{
                            holdStatusStringUnparsed="Offline"
                        }
                    }
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