var request = require("request");
var cheerio = require("cheerio");

var realGameName = "secret world legends";

function CheckGameStatus(callback){

        request({uri: "http://msgs.ageofconan.com/patchnotes.php?UniverseName=SWLLive&Language=en"}, function(error, response, body) {
            if(error){
                callback(null);
            }
            
            try{
                
                var $ = cheerio.load(body);

                var point1 = $('font');
                var point2 = $('b');

                var holdStatusStringUnparsed = point1.children().eq(1).text();
                var holdMaintenanceStringUnparsed = point2.children().eq(1).text();

                


                     console.log("Hold Status: " + holdStatusStringUnparsed);
                     console.log("Maint Status: " + holdMaintenanceStringUnparsed);



            }
            catch(errorUnhandled){
                throw errorUnhandled;
            }
        });        
}

CheckGameStatus();