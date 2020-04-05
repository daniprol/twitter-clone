const express = require("express"); // Load the module
const cors = require("cors");
// Create an application:
const app = express();

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

// Let's create the post route!
app.post("/tweets", (req, res) => {
  console.log(req.method);
  console.log(req.headers);
  console.log(req.body);
});
// Running this will start a server in port 5000
app.listen(5000, () => {
  console.log("Listening on http://localhost:5000");
});
