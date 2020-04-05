// Add event listener to the button:
const form = document.querySelector("form");

// Loading button:
const loadingElement = document.querySelector(".loading");
loadingElement.style.display = "none";

// Add a variable to store the server to send the data to:
const API_URL = "http://localhost:5000/tweets";

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
  });
});
