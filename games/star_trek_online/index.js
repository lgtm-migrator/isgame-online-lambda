////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /games/star_trek_online/index.js
///////////////////////////////////////

var request = require("request");
var cheerio = require("cheerio");
var gameStatus = require('../../models/gamestatus');

var config = require('../../config');
let configInstance = new config();

var realGameName = "star trek online";

function CheckGameStatus(callback){

        request({uri: "http://launcher.startrekonline.com/launcher_login"}, function(error, response, body) {
            if(error){
                callback(null);
            }
            
            try{
                
                var $ = cheerio.load(body);

                var point1 = $('.server_status');

                var holdStatusStringUnparsed = point1.attr("data-status");
                

                if(holdStatusStringUnparsed === "up"){
                    holdStatusStringUnparsed = "Online"; //fixup to online for return matchin.
                }
                else if(holdStatusStringUnparsed === "down"){
                    holdStatusStringUnparsed = "Offline";
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