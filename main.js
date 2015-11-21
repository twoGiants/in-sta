// IMPORTANT; ERROR HANDLING
// error at JSON.parse if the file is empty
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

main();

function main() {
    // call a function every "delay" seconds "duration" times
    var delay = 43200;
    var duration = 3;
    
    var intId = setInterval(function() {
        var timestamp = new Date();
        console.log("timestamp: " + timestamp.getTime());
        
        // run the code
        getRemoteData();
        
        // stop after x iterations
        if(duration <= 1) {
            clearInterval(intId);
        } else {
            duration--;
        }
        
    }, delay);
}

function getRemoteData() {
    var userIndex = 0;
    var user = ["modelsdot", "beardbrand", "stazzmatazz"];
    var sourceUrls = ["http://iconosquare.com/", "https://instagram.com/"]
    var sourceIndex = 0;
    var userUrl = sourceUrls[sourceIndex] + user[userIndex];
    var selector = [
        'a[class="followers user-action-btn"] span[class=chiffre]',
        'a[class="followings user-action-btn"] span[class=chiffre]'
    ];
    var fileName = "statistics.json";
    
    console.log("Setup done. Go.")
    console.log("...requesting remote data")
    
    // get remote data
    request(
        { uri: userUrl }, 
        function(err, response, body) {
            if (err) throw err;
            
            var $ = cheerio.load(body);
            var timestamp = new Date();
            
            var newData = {
                timestamp: timestamp.getTime().toString(), 
                followers: $(selector[0]).html().toString(), 
                followings: $(selector[1]).html().toString()
            };
            
            // log
            console.log("...got the data");
            console.log("timestamp: " + newData.timestamp);
            console.log("followers: " + newData.followers);
            console.log("followings: " + newData.followings);
            console.log('...saving');
            
            // safe data
            safeDataToJSONfile(newData, fileName);
        }
    );
}

function safeDataToJSONfile(newData, fileName) {
    fs.readFile(fileName, function(err, data) {
        if(err) throw err;
        
        // get data object
        var allData = JSON.parse(data);
        
        // push new data into data objects
        allData.statistics.push(newData);
        
        // safe to disk
        fs.writeFile(fileName, JSON.stringify(allData), function(err) {
            if(err) throw err; console.log('...done');
        });
    });
}