
var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('spotify-web-api-node');
var request = require('request');
var keys = require('./keys.js');

var argument2 = process.argv[2];
var argument3 = process.argv[3];

function switchFunction() {
    switch (argument2) {
        case "my-tweets":
            twitter();
            break;
        case "spotify-this-song":

            if (argument3 == undefined){
                argument3 = "The Sign";
            }
            spotify();
            break;
        case "movie-this":

            if(argument3 == undefined){
                argument3 = 'Mr. Nobody.';
            }
            movie();
            break;
        case "do-what-it-says":
            itSays();
            break;
        default:
            console.log('invalid entry');
    }
}

//https://dev.twitter.com/overview/api/tweets
function twitter(){
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret:  keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    //twitter function parameters:
    var parameters = {
        twitterHandle: 'geo_witt',
        count: 20
    };
    //get statuses from twitter
    client.get("statuses/user_timeline", parameters, function(error, tweets, response){
        if (!error && response.statusCode == 200) {
            for(var i = 0; i < tweets.length; i++){
                console.log(tweets[i].text + "Created on:" + tweets[i].created_at + "\n");
            }
            console.log("--end result--" + "\n");
        } else {
            console.log(error);
        }

    });
}

//https://developer.spotify.com/web-api/object-model/
function spotify() {
    console.log(argument3);
    var spotifyApi = new Spotify({
        clientID: keys.spotifyKeys.client_id,
        clientSecret: keys.spotifyKeys.client_secret
    });


    spotifyApi.searchTracks(argument3, {limit: 1}).then(function (data) {
        var tracks = data.body.tracks.items;

        for (var i in tracks) {
            console.log("-------------");
            console.log("Artist: " + tracks[i].artists[0].name);
            console.log("Song: " + tracks[i].name);
            console.log("Preview: " + tracks[i].preview_url);
            console.log("Album: " + tracks[i].album.name);
        }
        console.log("--end result--" + "\n");
    });
}


function movie() {

    var query_url = "http://www.omdbapi.com/?t=" + argument3 + "&y=&plot=long&tomatoes=true&r=json";

    request(query_url, function (error, data, body) {
        if (error) {
            console.log(error)
        }
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Release Date: " + JSON.parse(body).Released);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language(s): " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
        console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
        console.log("--end result--" + "\n");

    });
}


function itSays() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){
            console.log(error);
        } else {
            var dataArray = data.split(",");
            argument2 = dataArray[0];
            argument3 = dataArray[1];
        }
        switchFunction();

    }); //fs ends here
}
//call switch function
switchFunction();