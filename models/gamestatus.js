////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /models/gamestatus.js
///////////////////////////////////////

'use strict'; 
class GameStatus{

 constructor(inStatus, inMaintenance, realName){
    this.status = inStatus;
    this.nextmaintenance = inMaintenance;
    this.name = realName; //used for when alt mapping is not same. baseline and make them respond the same.
 }
}

module.exports = GameStatus;