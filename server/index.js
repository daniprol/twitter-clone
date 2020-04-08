const express = require("express"); // Load the module
const cors = require("cors");
const monk = require("monk");
const Filter = require("bad-words");
const rateLimit = require("express-rate-limit");
// Create an application:
const app = express();
// The database will be hosted locally
const db = monk(process.env.MONGO_URI || "localhost/ogrobe");
// const db = monk(process.env.MONGO_URI);

// We get the collection we need or create it if it doesn't exist yet.
const tweets = db.get("tweets");

// Create a new filter:
const filter = new Filter();
const newBadWords = ["cona", "carallo", "foder"];

filter.addWords(...newBadWords);

// Any income request to the server is going to pass through this middleware (i.e., CORS) and add the headers
app.use(cors());

// Add a json body parser from the express module. Otherwise the content of the POST request will be shown as undefined!!
app.use(express.json());
// DO NOT PLACE THE RATELIMT HERE OR IT WILL COUNT THE PAGE LOADING AS A REQUEST!

// Add event listener to the GET request to the slash route:
app.get("/", (request, response) => {
  response.json({
    message: "Elo, meu? Hoooome",
  });
});

// When we get the GET request /tweets, we need to respond with a query of the entire list of tweets:
app.get("/tweets", (req, res, next) => {
  tweets
    .find()
    .then((tweets) => {
      res.json(tweets);
    })
    .catch(next);
});

// New endpoint to build the pagination:
app.get("/v2/tweets", (req, res, next) => {
  console.log(req.query);
  // If the query has a skip parameter, use it. Otherwise set it to 0.
  //   let skip = Number(req.query.skip) || 0;
  //   let limit = Number(req.query.limit) || 10;

  // We can also destructure the query:
  let { skip = 0, limit = 5, sort = "desc" } = req.query;
  // If  we use this we need to change the strings to number!
  //   skip = isNaN(skip) ? 0 : Number(skip);
  //   limit = isNaN(limit) ? 10 : Number(limit);
  skip = parseInt(skip) || 0;
  limit = parseInt(limit) || 5;

  skip = skip < 0 ? 0 : skip;
  limit = Math.min(50, Math.max(1, limit));
  Promise.all([
    tweets.count(),
    tweets.find(
      {},
      {
        skip,
        limit,
        sort: {
          created: sort === "desc" ? -1 : 1,
        },
      }
    ),
  ])
    .then(([total, tweets]) => {
      res.json({
        tweets,
        meta: { total, skip, limit, hasMore: total - (skip + limit) > 0 },
      });
    })
    .catch(next);
});
app.use(
  rateLimit({
    windowMs: 20 * 1000, // 1 request every 20 seconds
    max: 1,
  })
);

// Validation function:
function isValidTweet(tweet) {
  return (
    tweet.name &&
    tweet.name.toString().trim() !== "" &&
    tweet.content &&
    tweet.content.toString().trim() !== ""
  );
}

const createTweet = (req, res) => {
  //   console.log(req.method);
  //   console.log(req.headers);
  //   console.log(req.body);
  // Add some server-side validation logic:
  if (isValidTweet(req.body)) {
    //insert into db
    const tweet = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
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
};

// Let's create the post route!
app.post("/tweets", createTweet);
app.post("/v2/tweets", createTweet);
// Running this will start a server in port 5000
app.listen(5000, () => {
  console.log("Listening on http://localhost:5000");
});
