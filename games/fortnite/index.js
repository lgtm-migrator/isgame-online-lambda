////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2019 Jonathan Hardison
// /games/fortnite/index.js
///////////////////////////////////////

var request = require("request");
var cheerio = require("cheerio");
var gameStatus = require('../../models/gamestatus');

var config = require('../../config');
let configInstance = new config();

var realGameName = "fortnite";

function CheckGameStatus(callback){

            request({uri: "https://ft308v428dv3.statuspage.io/api/v2/summary.json"}, function(error, response, body) {
                if(error){
                    callback(null);
                }
                
                try{
                    
                    var point1 = JSON.parse(body);
                    
                    var holdStatusStringUnparsed = "Offline";
                    
                    for(var name in point1.components){
                        
                        if(point1.components[name].name == "Fortnite"){
    
                            if(point1.components[name].status == "operational"){
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