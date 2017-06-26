////////////////////////////////////////
// isgame-online-lambda
//
// Copyright (c) 2017 Jonathan Hardison
// /config/index.js
////////////////////////////////////////

'use strict'; 
class Config{

 constructor(){
    this.bodyLimit = "100kb";
    this.port = process.env.PORT || 3005;
    this.debugEnabled = process.env.DEBUGENABLED || false;
    this.ravenDSN = process.env.RAVENDSN;
 }

}
module.exports = Config;