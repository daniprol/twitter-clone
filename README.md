# Full Stack Twitter Clone (by Coding Garden)

### Structure

1. **Front-end**: client (everything that has a web browser).
2. **Back-end**:
   1. Static file server (we'll use live-server)
   2. Dynamic server (will use Node.js): this will basically return JSON data (so we are building a JSON API)
   3. Database

### Objectives:

1. Get user input on the Client
2. Send user input from the Client with fetch to the server.
3. Store data in a database.
4. Retrieve data from a database on the Server.
5. Retrieve data from a server on the client using fetch.
6. Hide/Show elements on the client.
7. Add elements to the page on the client.
8. Deploy the client with now.sh
9. Deploy the database with mlab
10. Deploy the server with now.sh

## Client

#### <u>CSS insights:</u>

1. ```css
   textarea {
     resize: none;
   }
   ```

2.

#### <u>JavaScript insights:</u>

1. Every time you see `document.` it mean we are using client-side JS and not server-side.

2. When creating a form use the attribute `name="content"` in the HTML tag so you can select the value later in the _submit event_ from the JS easily:

   ```javascript
   form.addEventListener("submit", (event) => {
     event.preventDefault();
     console.log(event.target.name.value);
     console.log(event.target.content.value);
   });
   ```

3) Alternative to all the previous: use **<u>FormData(form)</u>** !:

   ```javascript
   form.addEventListener("submit", (event) => {
     event.preventDefault();
     const formData = new FormData(form);
     const name = formData.get("name");
     const content = formData.get("content").trim();

   ```

## Back-end

1. Initiate the Node.js project with a package JSON: `npm init -y` . This creates a black _package.json_ with the user info.

2. We'll use **Express** as the framework to listen to requests that come from the client.

3. We'll also use a middleware library called **Morgan** that will log all the incoming requests.

`npm install express morgan`

4. Create server with **Express**:

   ```javascript
   const express = require("express"); // Load the module
   const app = express();
   app.listen(5000, () => {
     console.log("Listening on http://localhost:5000");
   });
   ```

5) Create a _script_ in the _package.json_ to start the server with one command:

   ```javascript
   {
   "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1",
       "start": "node index.js"
   	}
   }
   ```

Now you can use **npm start** to start the server!!!! (You need to be in the server folder to execute that command!!)

**IMPORTANT**: when working with Node.js every time you modify the files you need to restart the server.

To deal with this use: `node i --save-dev nodemon`

and create a new script: `"dev": "nodemon index.js"`

Finally, execute `npm run dev` (remember to use the **RUN** word!)

6. Now we'll add a listener for a GET request in the server

   By default when we type in the browser _https://localhost:5000/_ we are making a GET request to the **"/"** route.

   ```javascript
   // Add event listener to the GET request to the slash route:
   app.get("/", (request, response) => {
     response.json({
       message: "Elo, meu? Hoooome",
     });
   });
   ```

   Now, see the magic in the browser!!

7. Now, use the fetch API to make a post request:

   ```javascript
   const API_URL = "http://localhost:5000/tweets";

   fetch(API_URL, {
       method: "POST",
       body: JSON.stringify(tweet),
       headers: {
         "content-type": "application/json",
       }
   ```

   Remember that you need to pass only JSON objects, so use **JSON.stringify**.

8. Now in the back-end, console.log() the request:

   ```javascript
   // Let's create the post route!
   app.post("/tweets", (req, res) => {
     console.log(req.method);
     console.log(req.headers);
     console.log(req.body);
   });
   ```

9. Add some server side validation:

   ```javascript
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
       };
       console.log(tweet);
     } else {
       res.status(422);
       res.json({
         message: "Ey meu! Tes que poñer un nome e unha mensaxe",
       });
     }
   });
   ```

   **PREVENT SQL INJECTION**: when creating the object to pass to the db, use the JS method **toString()**

#### Avoid cross CORS error (or RR_SSL_PROTOCOL_ERROR in Chrome):

The browser is not allowing any server to run JavaScript as a security measure.

So in the server folder install: `npm install cors` (we can always use this module when we are in control of the server)

Now add the CORS headers functionality to the server index file:

```javascript
const cors = require("cors");
// Any income request to the server is going to pass through this middleware (i.e., CORS)
app.use(cors());
```

IMPORTANT: when making the fetch post request use the url:

`const API_URL = "http://localhost:5000/tweets";`(**if you use https the CORS module won't work!!**)

If you try to console.log() the request you can print the _method_ and the _headers_, but the actual content will show **undefined**. To deal with this we need to add a middleware that will parse the incoming data:

```javascript
app.use(express.json()); //This is just a json body parser!
```

With this function we will parse any kind of request that has `"content-type": "application/json",`

### Database:

1. Install monk: `npm i monk`

2. Import the package and create a collection:

   ```javascript
   const monk = require("monk");

   // The database will be hosted locally
   const db = monk("localhost/ogrobe");

   // We get the collection we need or create it if it doesn't exist yet.
   const tweets = db.get("tweets");
   ```

3. Add the tweet to the db after getting the POST request. Then respond by sending back the new object:

   ```javascript
   app.post("/tweets", (req, res) => {
     if (isValidTweet(req.body)) {
       //insert into db
       const tweet = {
         name: req.body.name.toString(),
         content: req.body.content.toString(),
         created: new Date(),
       };

       tweets.insert(tweet).then((createdTweet) => {
         res.json(createdTweet);
       });
   ```

4) Complete the **fetch** call by responding to the promise. Console log the received tweet from the db after parsing it as json! Finally reset the form and clear the loading icon.

5) Query the collection of tweets if there's a GET request **/tweets**:

   ```javascript
   app.get("/tweets", (req, res) => {
     tweets.find().then((tweets) => {
       res.json(tweets);
     });
   });
   ```

   Now you can see the magic in: `http://127.0.0.1:5000/tweets`
