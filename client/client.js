// Add event listener to the button:
const form = document.querySelector("form");
// form.style.display = "none";
// Select the feed element:
const feedElement = document.querySelector(".feed");
// Loading button:
const loadingElement = document.querySelector(".loading");
loadingElement.style.display = "none";

// Add a variable to store the server to send the data to:
const API_URL = "http://localhost:5000/tweets";

listAllTweets();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  //   console.log(event.target.name.value);
  //   console.log(event.target.content.value);
  const formData = new FormData(form);
  const name = formData.get("name");
  const content = formData.get("content").trim();

  const tweet = { name, content };

  loadingElement.style.display = "";
  form.style.display = "none";

  //   console.log(tweet);
  // Now, instead of printing the info we are going to make a post request!
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(tweet),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
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
});

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
        div.classList.add("tweet");
        feedElement.appendChild(div);
      });
      //   loadingElement.style.display = "none";
      //   form.style.display = "";
    });
}
