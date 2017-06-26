////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
////////////////////////////////////////

var config = require('./config');
var alexa = require("alexa-app");
//var Raven = require('raven');


//controllers
var gamestatusengine = require('./controllers/game-statusengine');
var gamecheckisvalid = require('./controllers/game-checkisvalid');

let configInstance = new config();

// ALWAYS setup the alexa app and attach it to express before anything else.

var alexaApp = new alexa.app("v1alexaapi");
    // alexaApp.pre = function(request, response, type) {
    //     if(request.applicationId != "amzn1.ask.skill.ffe13be5-1255-4bf7-a243-b89bf41f373b")
    //     {
    //         return response.fail("Invalid applicationId");
    //     }
    // }




alexaApp.launch(function(request, response) {

  response.say("Is Game Online opened.");
  response.shouldEndSession (false, "What game would you like status for? To leave Is Game Online, say exit.");
  response.send();

});

// AMAZON.HelpIntent /////////////////////////////////////////////////////////////////
alexaApp.intent("AMAZON.HelpIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var helpoutput = "Is Game Online allows you to check status of some online video games. You may ask for example, is, game name here, up?";
  	response.say(helpoutput);
    response.shouldEndSession (false, "What game would you like status for? To leave Is Game Online, say exit.");
  	return response.send();
});

// AMAZON.StopIntent /////////////////////////////////////////////////////////////////
alexaApp.intent("AMAZON.StopIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var stopoutput = "Goodbye."
  	response.say(stopoutput)
  	return
});

// AMAZON.CancelIntent /////////////////////////////////////////////////////////////////
alexaApp.intent("AMAZON.CancelIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var canceloutput = "Goodbye."
  	response.say(canceloutput)
  	return
});

// GAME STATUS ///////////////////////////////////////////////////////////////////////
alexaApp.intent("GameStatus",
    {"dialog": {
      type: "delegate"
    },
    "slots":{
          "GameStaus": "AMAZON.VideoGame"
    },
    "utterances": ["is {AMAZON.VideoGame} up",
        "check on {AMAZON.VideoGame}",
        "what is the status of {AMAZON.VideoGame}",
        "find status of {AMAZON.VideoGame}",
        "is {AMAZON.VideoGame} down",
        "if {AMAZON.VideoGame} is up",
        "if {AMAZON.VideoGame} is down",
        "what the status of {AMAZON.VideoGame} is",
        "if {AMAZON.VideoGame} is online",
        "if {AMAZON.VideoGame} is offline",
        "status of {AMAZON.VideoGame}",
        "{AMAZON.VideoGame} state"]
    },

 function(request, response) {

    var gameAsked = request.slot("AMAZON.VideoGame");
    var gameIsValid = gamecheckisvalid(gameAsked);
    if(typeof gameAsked === "undefined"){
        response.shouldEndSession (false, "What game would you like status for?");
        return response.send();
    }

    if(gameIsValid != null){
        
        return gamestatusengine(gameIsValid).then(function (gamestatus) {
            if(configInstance.debugEnabled){console.log(gamestatus);}
            if(gamestatus.status != null){
                
                if(gamestatus.status == "Online")
                {
                    var responseText = `Yes, ${gameAsked} is currently ${gamestatus.status}`;
                    response.say(responseText);
                }
                else if(gamestatus.status == "Offline")
                {
                    var responseText = `No, ${gameAsked} is currently ${gamestatus.status}`;
                    response.say(responseText);
                }
                else{
                    var responseText = `I'm not sure, but chances are ${gameAsked} is currently unavailable.`;
                    response.say(responseText);
                }
            
                if(configInstance.debugEnabled){console.log(response);}
                return response.send();

            }
            else
            {
                response.clear().say(`Sorry there was an error checking the status for ${gameAsked}`);
                return response.send();
            }
        });
    }
    else{
        response.clear().say(`Sorry, ${gameAsked} is not yet supported. The internets will work to make this so.`);
        return response.send();
    }
  }
);

//Raven.config(configInstance.ravenDSN).install();

exports.handler = alexaApp.lambda();