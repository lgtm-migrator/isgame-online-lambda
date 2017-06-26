////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /controllers/game-checkisvalid.js
///////////////////////////////////////

var config = require('../config');
let configInstance = new config();

//game list objects
var gamesSupported = { 
    "secret world legends": "secret_world_legends",
    "the secret world": "the_secret_world",
    "age of conan": "age_of_conan_us"
};

function CheckGameIsValid(gametocheck){

        if((gametocheck != null) || (gametocheck != 'undefined')){
            var testvalue = gamesSupported[gametocheck];
            if(configInstance.debugEnabled){
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