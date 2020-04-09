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

6) Create client function to list all tweets when the page is loaded or when a message is submitted:

   ```javascript
   function listAllTweets() {
     // Before listing all the tweets we need to clear all the feed so we don't get duplicates when we submit something:
     feedElement.innerHTML = "";

     // With GET requests you don't need to specify any headers or options!
     // Always remember to parse the respond as JSON!
     fetch(API_URL)
       .then((response) => response.json())
       .then((tweets) => {
         console.log(tweets);

         // If you want to show the messages in reverse order (i.e., latest messages first)
         //   tweets.reverse();

         tweets.forEach((tweet) => {
           const div = document.createElement("div");
           const header = document.createElement("h5");
           header.textContent = tweet.name + ":";

           const contents = document.createElement("p");
           contents.textContent = tweet.content;

           const date = document.createElement("small");
           date.textContent = new Date(tweet.created);

           div.appendChild(header);
           div.appendChild(contents);
           div.appendChild(date);

           feedElement.appendChild(div);
         });
         loadingElement.style.display = "none";
         form.style.display = "";
       });
   }
   ```

   (Add some style to the **feed** element in the CSS)

### Filter for bad words:

1. `npm install bad-words`

2. Create filter and add some bad words using the spread operator:

   ```javascript
   const Filter = require("bad-words");
   const filter = new Filter();
   const newBadWords = ["cona", "carallo", "foder"];
   filter.addWords(...newBadWords);
   ```

3. Use the filter before adding a message to the database:

   ```javascript
   app.post("/tweets", (req, res) => {
     if (isValidTweet(req.body)) {
       // Filter the name and the content of the request
       const tweet = {
         name: filter.clean(req.body.name.toString()),
         content: filter(req.body.content.toString()),
         created: new Date(),
       };
       tweets.insert(tweet).then((createdTweet) => {
         res.json(createdTweet);
       });
     }
   });
   ```

### Add a request limit:

1. `npm install express-rate-limit`

2. By default it limits **EVERYTHING** (e.g., when you reload the page it will count as 1 request as well!), so you need to place the **rateLimit** function in the right place.

   **IMPORTANT**: in _express_ every method we add to the _app_ executes sequentially (first use, then get, then post...). So, if you place the rateLimit after the page loads all the tweets then that won't count as a request!.

   ```javascript
   const rateLimit = require("express-rate-limit");

   const app = express();
   // DO NOT PLACE THE RATELIMT HERE OR IT WILL COUNT THE PAGE LOADING AS A REQUEST!

   // Here is the GET request for the feed
   app.get("/tweets", (req, res) => {
     tweets.find().then((tweets) => {
       res.json(tweets);
     });
   });

   // Now you can place the rateLimit, so it's not affected by the feed loading
   app.use(
     rateLimit({
       windowMs: 20 * 1000, // 1 request every 20 seconds
       max: 1,
     })
   );
   ```

3. If you want to avoid the user from sending more requests you can always set a timeout function in the client that hides the form until the required time passes:

   ```javascript
   .then((createdTweet) => {
       console.log(createdTweet);
       form.reset(); // Remember this!!!
       setTimeout(() => {
           // Now hide the loading element:
           loadingElement.style.display = "none";
           form.style.display = "";
       }, 30000);
       listAllTweets();
   });
   ```

## Deployment

1. We will deploy the <u>back end</u> using **Zeit now** (so sign up first in their website!).

2. Install the **now-cli** with `npm install -g now` in the folder you want to deploy.

3. In this case we want to deploy the server.

4. `now login` with our user account.

5. `now start` inside the **server** folder. This will create a _now_ project and a _.now_ folder.

6. Up to now the connection to the database was made using the localhost. To change this use an **environment variable**:

   ```javascript
   const db = monk(process.env.MONGO_URI || "localhost/ogrobe");
   ```

   With this, we'll connect to mongoDB Atlas (or to the localhost again if it's not defined)

7. Create a **mongoDB Atlas** account. Then, you have to create a cluster. Define a user for the cluster with read/write permissions and modify the IP whitelist so you can make a connection with your current IP.

8. We are going to secure the DB connection user/key with the command:

   `now secrets add ogrobe-db "mongodb+srv://<username>:<password>@cluster0-lnw9c.mongodb.net/test?retryWrites=true&w=majority"`

   Now the URI will be stored under the variables **ogrobe-db**

9. Add your secrets with _now_, where _ogrobe-db_ can be anything you want:

`now secrets add ogrobe-db mongodb://<dbuser>:<dbpassword>@ds249942.mlab.com:49942/ogrobe`

10. Deploy with environment variable: `now -e MONGO_URI=@ogrobe-db`. We are saying that our _MONGO_URI_ environment variable will be _@ogrove-db_

11. **Zeit now** gives us a unique URL, but we can use an alias:

    `now alias https://server-xcbctndkeg.nor.sh ogrobe-api`

    Now, we can access the back-end by: `https://ogrobe-api.now.sh`

    **NOTE**: when we are ready to deploy to production use the command: `now --prod`

---

**FRONT-END DEPLOYMENT**:

1. Our _API_URL_ was pointing only to localhost. We change that:

```javascript
const API_URL =
  window.location.hostname === "localhost"
    ? "https://localhost:5000/tweets"
    : "https://ogrobe-api.now.sh";
```

2. Use the `now` command to deploy the <u>front-end</u> as well. Then, create an alias again by using:

`now alias https://client-xcbctndkeg.nor.sh ogrobe`

See the magic in `https://ogrobe.now.sh`

## Pagination

1. First we are going to create a new endpoint with a new URL:

```javascript
app.get("/v2/tweets", (req, res, next) => {
  // same as before...
});
```

​ We want to be able to do something like:

`http://localhost:5000/v2/tweets/?skip=0&limit=10` (this would grab the most recent 10 tweets)

​ (right now that request would work because it would ignore everything after the **/** )

2. We can console.log the query we just passed: `console.log(req.query);`

   The previous GET request would log: `{ skip: '0', limit: '10' }`

3. We can query the database with _skip_ and _limit_:

   ```javascript
   let skip = Number(req.query.skip) || 0;
   let limit = Number(req.query.limit) || 10;
   tweets
     .find({}, { skip, limit }) // The first {} queries all, then we set params
     .then((tweets) => {
       res.json(tweets);
     })
     .catch(next);
   ```

   We can also use destructuring the query and pass default values:

   ```javascript
   const { skip = 0, limit = 10 } = req.query;
   ```

   But we still need to change the strings to number!!:

   ```javascript
   tweets.find({}, { skip: Number(skip), limit: Number(limit) });
   ```

   **NOTE**: _skip_ means to pass the first _number_ tweets. _limit_ means that we get that number of tweets.

   Example: skip=3, limit=10 would get the tweets ranging from 3 to 13 (if there's 13 in the db)

4. Now we want to know how many tweets there are in the db, and return useful data in the response object:

   ```javascript
   let { skip = 0, limit = 10, sort = "desc" } = req.query;
   skip = Number(skip) || 0;
   limit = Number(limit) || 10;
   limit = limit > 50 ? 50 : limit;
   // We make the 2 requests at the same times by using: Promise.all([ query1, query2])
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
   ```

5) Change the API URL in the front-end:

   ```javascript
   const API_URL =
     window.location.hostname === "127.0.0.1"
       ? "http://localhost:5000/v2/tweets"
       : "https://ogrobe-api.now.sh/v2/tweets";
   ```

   Now, the front-end should be broken because we are returning an object with more data so we need to change:

   ```javascript
     fetch(API_URL)
       .then((response) => response.json())
       .then((result) => {
         console.log(result);
         result.tweets.forEach((tweet) => {
             // .......
         }})
   ```

6. When the client page loads, _skip_ and _limit_ default to 0 and 5. We will store them as **global variables** so we can use then in the request to the API.

   ```javascript
   let skip = 0;
   let limit = 5;
   fetch(`${API_URL}?skip=${skip}&limit=${limit}`);
   ```

**IMPORTANT**: be careful when destructuring in the front-end because not all browsers support it!

7. Create the button to load more tweets:

   ```html
   <div class="button-container">
     <button id="loadMoreButton" class="button-primary">
       Load more tweets
     </button>
   </div>
   ```

   We need to hide it by default:

   ```css
   #loadMoreButton {
     visibility: hidden;
   }
   ```

   And then use JS to show it when the list of tweets is loaded completely!

   ```javascript
   function listAllTweets() {
     // ....

     // At the end:
     loadMoreButton.style.visibility = "visible";
   }
   ```

8) Add an event listener to the button:

   ```javascript
   loadMoreButton.addEventListener("click", loadMore);
   ```

   And define that function:

   ```javascript
   function loadMore() {
     // We need to increase the skip by the limit and then load the new tweets:
     skip += limit;
     listAllTweets(false);
   }

   function listAllTweets(reset = true) {
     // If reset=true (usually when posting a new tweet), we will load everything
     // Otherwise the feed HTML will remain, and we'll just append the new tweets
     if (reset) {
       feedElement.innerHTML = "";
       skip = 0;
     }

     if (result.meta.hasMore) {
       loadMoreButton.style.visibility = "visible";
     } else {
       loadMoreButton.style.visibility = "hidden";
     }
   }
   ```

**NOTE**: difference between _display: none_ and _visibility: hidden_.

9. We'll try to add some smooth scrolling for when the button is pressed. **PENDING**

10. We'll implement infinite scrolling:

    ```javascript
    let loading = false;
    let finished = false;

    document.addEventListener("scroll", () => {
      //   console.log("scrolling...");
      const rect = loadMore.getBoundingClientRect();
      setTimeout(() => {
        if (rect.top < window.innerHeight && !loading && !finished) {
          loadMoreTweets(); // Set loading equal to true/false at the beg/end of the listTweets() function
        }
      }, 2000);
    ```

    **ALTERNATIVE**:

    ```javascript
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // clientHeight: how tall is the screen
    // scrollHeight: how much scroll has the entire page
    // scrollTop: scrolling level at the top of the screen RIGHT NOW
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      console.log("Now");
      loadMoreTweets();
    }
    ```

**TIP**: `npx serve` to create a local server

### NOW V2 DEPLOYMENT:

For static sites with just HTML, CSS and JS that **DON'T** require any kind of build process use **@now/static**

For React, Vue.JS, Gatsby, etc use **@now/static-build**

For a JS server use **@now/node-server** . This suits perfectly for Express applications that do all the routing internally (e.g., app.get(), app.use())

Use **@now/node** just for lambda functions (similar to a server.js but only returns 1 function)
