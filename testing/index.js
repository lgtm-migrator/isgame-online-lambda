var request = require("request");
var cheerio = require("cheerio");
var net = require("net");

var realGameName = "testing";


function CheckGameStatus(callback){

    
    var holdStatusStringUnparsed = "Offline";
    var statusResponse;
    try{
        request({uri: "https://ft308v428dv3.statuspage.io/api/v2/summary.json"}, function(error, response, body) {
            if(error){
                callback(null);
            }
            
            try{
                
                var point1 = JSON.parse(body);
                
                var holdStatusStringUnparsed = "Offline";
                
                for(var name in point1.components){
                    
                    if(point1.components[name].name == "Fortnite"){

                        if(point1.components[name].status == "operational"){
                            holdStatusStringUnparsed="Online";
                        }
                        else{
                            holdStatusStringUnparsed="Offline"
                        }
                    }
                }
                var statusResponse = new gameStatus(holdStatusStringUnparsed, null, realGameName);

                if(configInstance.debugEnabled){
                     console.log("Hold Status: " + holdStatusStringUnparsed);
                     console.log("Response Object" + statusResponse);
                }

                callback(statusResponse);
            }
            catch(errorUnhandled){
                throw errorUnhandled;
            }
        });        

        
        
    }
    catch(errorUnhandled){
        throw errorUnhandled;
    }
    


        
//ECONNREFUSED
//ENOTFOUND 
       
        // request({uri: "http://msgs.ageofconan.com/patchnotes.php?UniverseName=SWLLive&Language=en"}, function(error, response, body) {
        //     if(error){
        //         callback(null);
        //     }
            
        //     try{
                
        //         var $ = cheerio.load(body);

        //         var point1 = $('font');
        //         var point2 = $('b');

        //         var holdStatusStringUnparsed = point1.children().eq(1).text();
        //         var holdMaintenanceStringUnparsed = point2.children().eq(1).text();

                


        //              console.log("Hold Status: " + holdStatusStringUnparsed);
        //              console.log("Maint Status: " + holdMaintenanceStringUnparsed);



        //     }
        //     catch(errorUnhandled){
        //         throw errorUnhandled;
        //     }
        // });        
}

CheckGameStatus();