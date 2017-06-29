////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /controllers/game-checkisvalid.js
///////////////////////////////////////

var config = require('../config');
let configInstance = new config();

//game list objects
//includes alternate spellings based on alexa interpretation of spoken words.
var gamesSupported = require('../games/supportedgames').default;

function CheckGameIsValid(gametocheck){

        if((gametocheck != null) || (gametocheck != 'undefined')){
            var testvalue = gamesSupported[gametocheck];
            if(configInstance.debugEnabled == "true"){
                console.log("gametocheck: " + gametocheck);
                console.log("testvalue: " + testvalue);
            }

            if(testvalue != null)
            {
                return testvalue;
            }
            else{
                return null;
            }


        }
        else{
            return null;
        }
}//end function

module.exports = CheckGameIsValid;