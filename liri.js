var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');

// spotify argument
var spotify = require('spotify');
var argOne = process.argv[2];
var argTwo = process.argv[3];

// switch statements to enable control flow
function switchFunction() {
    switch(argOne){
        case 'my-tweets': myTweets();
            break;

        case 'spotify-this-song': spotifySong();
            break;

        case 'movie-this' : movieThis();
            break;

        case 'do-what-it-says' : doWhatItSays();
            break;
    }
}
// end switch statements

// begin twitter functions
// keys.js calls
function myTweets(){
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
            console.log("================" + "\n");
        } else {
            console.log(error);
        }

    });
}
// end twitter

// begin spotify function

function spotifySong() {
    var searchSong;
    if(argTwo === undefined){
        searchSong = "The Sign"; //Lame
    } else {
        searchSong = argTwo;
    }
    spotify.search({type: 'track', query: searchSong, count: 1}, function(error, data){
        if(error) {
            console.log('Error:' + error);

        } else{
            console.log("Artist:" + data.tracks.items[0].artists[0].name);
            console.log("Song Name:" + data.tracks.items[0].name);
            console.log("Album:" + data.tracks.items[0].album.name);
            console.log("Spotify Preview Link:" + data.tracks.items[0].preview_url);
            fs.appendFile('random.txt', "Artist:" + data.tracks.items[0].artists[0].name + "\n" + "Song Name:" + data.tracks.items[0].name + "\n" + "Album Name" + data.tracks.items[0].album.name + "\n" + "Spotify Preview Link:" + data.tracks.items[0].preview_url+ "\n");

        }
    })
} // end spotify
// begin omdb

function movieThis() {

    var movieInfo;
    if(argTwo === undefined){
        movieInfo = "Mr. Nobody";
    } else {
        movieInfo = argTwo;
    }
    var omdbApi = 'http://www.omdbapi.com/?t=' + movieInfo +'&y=&plot=long&tomatoes=true&r=json';
    request(omdbApi, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Title:" + JSON.parse(body) ["Title"]);
            console.log("Year:" + JSON.parse(body) ["Year"]);
            console.log("IMDB Rating:" + JSON.parse(body) ["imdbRating"]);
            console.log("Country:" + JSON.parse(body) ["Country"]);
            console.log("Language:" + JSON.parse(body) ["Language"]);
            console.log("Plot:" + JSON.parse(body) ["Plot"]);
            console.log("Actors:" + JSON.parse(body) ["Actors"]);
            console.log("Rotten Tomatoes Rating:" + JSON.parse(body) ["rottenTomatoesRating"]);
        }
    });
}
// end omdb


function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){
            console.log(error);
        } else {
            var dataArray = data.split(",");
            argOne = dataArray[0];
            argTwo = dataArray[1];
        }
        switchFunction();

    }); //fs ends here
}
switchFunction();

