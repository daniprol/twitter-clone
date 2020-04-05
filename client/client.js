// Add event listener to the button:
const form = document.querySelector("form");

// Loading button:
const loadingElement = document.querySelector(".loading");
loadingElement.style.display = "none";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  //   console.log(event.target.name.value);
  //   console.log(event.target.content.value);
  const formData = new FormData(form);
  const name = formData.get("name");
  const content = formData.get("content").trim();

  const tweet = { name, content };
  console.log(tweet);

  loadingElement.style.display = "";
  form.style.display = "none";
});
