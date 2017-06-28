////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /games/age_of_conan_us/index.js
///////////////////////////////////////

var request = require("request");
var cheerio = require("cheerio");
var gameStatus = require('../../models/gamestatus');

var config = require('../../config');
let configInstance = new config();

var realGameName = "age of conan";

function CheckGameStatus(callback){

        request({uri: "http://msgs.ageofconan.com/patchnotes.php?UniverseName=AoCLiveUS&Language=en"}, function(error, response, body) {
            if(error){
                callback(null);
            }
            
            try{
                
                var $ = cheerio.load(body);

                var point1 = $('font');
                
                var holdStatusStringUnparsed = point1.eq(1).text();
                var holdMaintenanceStringUnparsed = point1.eq(4).text();

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