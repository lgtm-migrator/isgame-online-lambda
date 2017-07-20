////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /games/star_trek_online/index.js
///////////////////////////////////////

var net = require("net");
var request = require("request");
var cheerio = require("cheerio");
var gameStatus = require('../../models/gamestatus');

var config = require('../../config');
let configInstance = new config();

var realGameName = "star citizen";

function CheckGameStatus(callback){

    
    var holdStatusStringUnparsed = "Offline";
    var statusResponse;
    try{
        const client = net.createConnection({port: 8000, host: "public.universe.robertsspaceindustries.com"}, () => {
            //'connect' listener
            //console.log('connected to server!');
            client.write('isgame.online test poll');
            holdStatusStringUnparsed = "Online";
            statusResponse = new gameStatus(holdStatusStringUnparsed, null, realGameName);
            callback(statusResponse);
        });

        client.on('error',function(err){
            if(err.code=="ECONNREFUSED"){
                //console.log("econnrefused");
                holdStatusStringUnparsed = "Offline";
            }
            else if(err.code=="ENOTFOUND"){
                //console.log("enotfound");
                holdStatusStringUnparsed = "Offline";
            }
            else{
                console.log("all other failures");
                holdStatusStringUnparsed = "Offline";
            }
            statusResponse = new gameStatus(holdStatusStringUnparsed, null, realGameName);
            client.end();
            callback(statusResponse);
        });

        
        
    }
    catch(errorUnhandled){
        throw errorUnhandled;
    }
    
}

module.exports = CheckGameStatus;