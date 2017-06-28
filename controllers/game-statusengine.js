////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /controllers/game-statusengine.js
///////////////////////////////////////

var config = require('../config');
let configInstance = new config();
var q = require('q');

function CheckGameStatus(gametocheck, callback){
    return q.Promise(function(resolve, reject, notify){
        if((gametocheck != null) || (gametocheck != 'undefined')){

             if(configInstance.debugEnabled == "true"){
                 console.log("game to check for status is: " + gametocheck);
                }

            var gameVar = require(`../games/${gametocheck}`);
                
            gameVar((response) => {
                if(configInstance.debugEnabled == "true"){
                    console.log("entered gametocheck");
                    console.log("status engine response: " + response.status);
                }

                if(response.status != null){
                    resolve(response);
                }
                else{
                    resolve(null);
                }
            });
            

        }});//end if game to check
}//end function

module.exports = CheckGameStatus;