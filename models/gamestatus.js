////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /models/gamestatus.js
///////////////////////////////////////

'use strict'; 
class GameStatus{

 constructor(inStatus, inMaintenance){
    this.status = inStatus;
    this.nextmaintenance = inMaintenance;
 }
}

module.exports = GameStatus;