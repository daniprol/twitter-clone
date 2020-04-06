const express = require("express"); // Load the module
const cors = require("cors");
const monk = require("monk");
// Create an application:
const app = express();

// The database will be hosted locally
const db = monk("localhost/ogrobe");

// We get the collection we need or create it if it doesn't exist yet.
const tweets = db.get("tweets");

// Any income request to the server is going to pass through this middleware (i.e., CORS) and add the headers
app.use(cors());

// Add a json body parser from the express module. Otherwise the content of the POST request will be shown as undefined!!
app.use(express.json());

// Add event listener to the GET request to the slash route:
app.get("/", (request, response) => {
  response.json({
    message: "Elo, meu? Hoooome",
  });
});

// When we get the GET request /tweets, we need to respond with a query of the entire list of tweets:
app.get("/tweets", (req, res) => {
  tweets.find().then((tweets) => {
    res.json(tweets);
  });
});

// Validation function:
function isValidTweet(tweet) {
  return (
    tweet.name &&
    tweet.name.toString().trim() !== "" &&
    tweet.content &&
    tweet.content.toString().trim() !== ""
  );
}
// Let's create the post route!
app.post("/tweets", (req, res) => {
  //   console.log(req.method);
  //   console.log(req.headers);
  //   console.log(req.body);
  // Add some server-side validation logic:
  if (isValidTweet(req.body)) {
    //insert into db
    const tweet = {
      name: req.body.name.toString(),
      content: req.body.content.toString(),
      created: new Date(),
    };
    // console.log(tweet);

    tweets.insert(tweet).then((createdTweet) => {
      res.json(createdTweet);
    });
  } else {
    res.status(422);
    res.json({
      message: "Ey meu! Tes que poñer un nome e unha mensaxe",
    });
  }
});
// Running this will start a server in port 5000
app.listen(5000, () => {
  console.log("Listening on http://localhost:5000");
});
