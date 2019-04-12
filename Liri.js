var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require("moment")
var fs = require("fs")
// Store all of the arguments in an array
var nodeArgs = process.argv;

// Create an empty variable for holding the movie name
var userEntry = "";

function userInput(plus) {
    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s
    for (var i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            userEntry = userEntry + plus + nodeArgs[i];
        }
        else {
            userEntry += nodeArgs[i];

        }
    }
}

var action = process.argv[2];
// var value = process.argv[3];

// We will then create a switch-case statement (if-else would also work).
// The switch-case will direct which function gets run.
switch (action) {
    case "concert-this":
        userInput("%20")
        concert(userEntry);
        break;

    case "spotify-this-song":
        userInput("+")
        song(userEntry);
        break;

    case "movie-this":
        userInput("+")
        movie(userEntry);
        break;

    case "do-what-it-says":
        doIt();
        break;
}

function song(userEntry) {
    var music = new Spotify(keys.spotify);
    music.search({ type: 'track', query: userEntry, limit: 5  })
  .then(function(response) {
    console.log("Artist: " + response.tracks.items[0].artists[0].name);
    console.log("Song: " + response.tracks.items[0].name)
    console.log("Song Link: " + response.tracks.items[0].external_urls.spotify)
  })
  .catch(function(err) {
    console.log(err);
  });
}

function concert(userEntry) {
    var bandURL = "https://rest.bandsintown.com/artists/" + userEntry + "/events?app_id=codingbootcamp"
    // help debug URL
    console.log(bandURL)
    axios.get(bandURL).then(
        function (response) {
            var band = response.data[0]
            console.log("Artist: " + band.lineup[0])
            console.log("Venue: " + band.venue.name, "\n", "Country: " + band.venue.country, "\n", 
            "Region: " + band.venue.region, "\n", "City: " + band.venue.city)
            console.log("Show date: " + moment(band.datetime).format("MM/DD/YYYY"))
        }
    )
}

function movie(userEntry) {
    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + userEntry + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);

    axios.get(queryUrl).then(
        function (response) {
            var film = response.data
            console.log("Title: " + film.Title, "\n", "Year: " + film.Year, "\n", "IMDB Ratings: " + film.Ratings[0].Value, "\n",
             "Rotten Tomatoes Rating: " + film.Ratings[1].Value, "\n", "Countries: " + film.Country, "\n", "Languages: " + film.Language, "\n",
              "Plot: " + film.Plot, "\n", "Actors: " + film.Actors);
        }
    );
}
function doIt() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
        var output = data.split(",");
        // the (/"/g,'') removes the quotes so that the text can go where userEntry is in the link
        song(output[1].replace(/"/g,''));
        movie(output[3].replace(/"/g,''));
        concert(output[5].replace(/"/g,''));
    })
}