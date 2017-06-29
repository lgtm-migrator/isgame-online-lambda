////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
////////////////////////////////////////

var config = require('./config');
var alexa = require("alexa-app");
var Raven = require('raven');


//controllers
var gamestatusengine = require('./controllers/game-statusengine');
var gamecheckisvalid = require('./controllers/game-checkisvalid');

let configInstance = new config();
Raven.config(configInstance.ravenDSN).install();

// ALWAYS setup the alexa app and attach it to express before anything else.

var alexaApp = new alexa.app("v1alexaapi");
alexaApp.pre = function(request, response, type) {
    var session = request.getSession();

    if(configInstance.debugEnabled == "false")
    {
        //skip for debug
    
        if(request.applicationId != "amzn1.ask.skill.ffe13be5-1255-4bf7-a243-b89bf41f373b")
        {
            Raven.captureException(new Error("Invalid ApplicationID: " + request.applicationId + " Type: " + type + " Request: " + request + " Session ID: " + session.applicationId));
            return response.fail("Invalid applicationId");
        }
    }
    else if(configInstance.debugEnabled == "true"){
        console.log("Session APPID: " + session.applicationId);
        console.log("Request APPID: " + request.applicationId);
        console.log("Debug Flag: " + configInstance.debugEnabled);
        console.log(request);
    }
}
alexaApp.error = function(exception, request, response) {
    Raven.captureException(exception);
    response.say("Sorry, an issue occurred.").shouldEndSession(true);
};

alexaApp.launch(function(request, response) {

  response.say("Is Game Online opened. You may ask for the status of a game by saying, is Secret World Legends up? Or, what is the status of The Secret World? So, what may I do for you today?").shouldEndSession(false);
  if(configInstance.debugEnabled=="true"){
        console.log("Entered launch.");
    }
  //return false;
});

// sessionEnded /////////////////////////////////////////////////////////////////
alexaApp.sessionEnded(function(request, response) {
  // cleanup the user's server-side session
  // no response required
  if(configInstance.debugEnabled=="true"){
        console.log("Entered sessionEnded.");
    }  
});


// AMAZON.HelpIntent /////////////////////////////////////////////////////////////////
alexaApp.intent("AMAZON.HelpIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
    if(configInstance.debugEnabled=="true"){
        console.log("Entered HELP.");
    }
  	var helpoutput = "Is Game Online allows you to check status of some online video games. You may ask for the status of a game by saying, is Secret World Legends up? Or, what is the status of The Secret World? So, what may I do for you today?";
  	response.say(helpoutput).reprompt().shouldEndSession (false);
  	//return false;
});

// AMAZON.StopIntent /////////////////////////////////////////////////////////////////
alexaApp.intent("AMAZON.StopIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var stopoutput = "Goodbye.";
  	response.say(stopoutput).shouldEndSession(true);
  	return;
});

// AMAZON.CancelIntent /////////////////////////////////////////////////////////////////
alexaApp.intent("AMAZON.CancelIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var canceloutput = "Goodbye.";
  	response.say(canceloutput).shouldEndSession(true);
  	return;
});

// GAME STATUS ///////////////////////////////////////////////////////////////////////
alexaApp.intent("GameStatus",
    {
    //     "dialog": {
    //     type: "delegate"
    // },
    "slots":{
          "AMAZON.VideoGame": "AMAZON.VideoGame"
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
        "{AMAZON.VideoGame} state",
        "is {AMAZON.VideoGame} available",
        "is {AMAZON.VideoGame} operational"]
    },
 function(request, response) {

    try{
        var gameAsked = request.slot("AMAZON.VideoGame");       
        if(typeof gameAsked === "undefined" || gameAsked === ""){
            response.say("Tell me a supported game.").reprompt("What game would you like status for?").shouldEndSession(false).send();
            //return false;
            if(configInstance.debugEnabled=="true"){
                console.log("Undefined game, response sent: " + response);
            }
        }
        else{
            var gameIsValid = gamecheckisvalid(gameAsked);
            gameAsked = gameAsked.toLowerCase();

            if(gameIsValid != null){
                
                return gamestatusengine(gameIsValid).then(function (gamestatus) {
                    if(configInstance.debugEnabled){console.log(gamestatus);}
                    if(gamestatus.status != null){
                        
                        if(gamestatus.status == "Online")
                        {
                            var responseText = `Yes, ${gamestatus.name} is currently ${gamestatus.status}`;
                            response.say(responseText);
                        }
                        else if(gamestatus.status == "Offline")
                        {
                            var responseText = `No, ${gamestatus.name} is currently ${gamestatus.status}`;
                            response.say(responseText);
                        }
                        else{
                            var responseText = `I'm not sure, but chances are ${gameAsked} is currently unavailable.`;
                            response.say(responseText);
                        }
                    
                        if(configInstance.debugEnabled=="true"){
                            console.log("Valid game loop, response sent: " + response);
                        }
                        
                        response.shouldEndSession(true);
                        return response.send();

                    }
                    else
                    {
                        
                        response.clear().say(`Sorry there was an error checking the status for ${gameAsked}`);
                        response.shouldEndSession(true);

                        if(configInstance.debugEnabled=="true"){
                            console.log("Error checking game, response sent: " + response);
                        }
                        Raven.captureException("Error checking status of game: " + gameAsked);
                        return response.send();
                    }
                });
            }
            else{
                response.clear().say(`Sorry, ${gameAsked} is not yet supported. The internets will work to make this so.`);
                response.shouldEndSession(true);
                if(configInstance.debugEnabled=="true"){
                    console.log("Unsupported game, response sent: " + response);
                }
                Raven.captureException("Unsupported game: " + gameAsked);
                return response.send();
            }
        }
    }//try
    catch(e){
        Raven.captureException(e);
        if(configInstance.debugEnabled=="true"){
                console.log("Error: " + e);
        }
        response.clear().say("Sorry, something went wrong. Please try your request again.").shouldEndSession(false);
    }//catch
  }
);

exports.handler = alexaApp.lambda();