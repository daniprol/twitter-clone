// Add event listener to the button:
const form = document.querySelector("form");
// form.style.display = "none";
// Select the feed element:
const feedElement = document.querySelector(".feed");
// Loading button:
const loadingElement = document.querySelector(".loading");
loadingElement.style.display = "none";
const loadMore = document.getElementById("loadMore");
// Add a variable to store the server to send the data to:
const API_URL =
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/v2/tweets/"
    : "https://ogrobe-api.now.sh/v2/tweets";

// Define global variables:
let skip = 0;
let limit = 5;
let loading = false;
let finished = false;

document.addEventListener("scroll", () => {
  //   console.log("scrolling...");
  const rect = loadMore.getBoundingClientRect();
  setTimeout(() => {
    if (rect.top < window.innerHeight && !loading && !finished) {
      loadMoreTweets();
    }
  }, 2000);
  // Alternative:
  //   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  // scrollTop
  // clientHeight: how tall is the screen
  // scrollHeight: how much scroll has the entire page
  // ScrollTop: scrolling level at the top of the screen RIGHT NOW
  //   if (scrollTop + clientHeight >= scrollHeight - 5) {
  // console.log("Now");
  // showLoading();
  //   }
});

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

function loadMoreTweets() {
  // We need to increase the skip by the limit and then load the new tweets:
  skip += limit;
  listAllTweets(false);
}

function listAllTweets(reset = true) {
  // Before listing all the tweets we need to clear all the feed so we don't get duplicates when we submit something:
  if (reset) {
    feedElement.innerHTML = "";
    skip = 0;
  }
  loading = true;
  // With GET requests you don't need to specify any headers or options!
  // Always remember to parse the respond as JSON!
  fetch(`${API_URL}?skip=${skip}&limit=${limit}`)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      // If you want to show the messages in reverse order (i.e., latest messages first)
      //   tweets.reverse();

      result.tweets.forEach((tweet) => {
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
      if (result.meta.hasMore) {
        loadMore.style.visibility = "visible";
      } else {
        loadMore.style.visibility = "hidden";
        finished = true;
      }
      loading = false;
    });
}
