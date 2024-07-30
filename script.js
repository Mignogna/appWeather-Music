const input = document.getElementById("input-search");
const apiKey = "5c106a5c805ddb4368b0427789a0dc63";
const clientId = "59e99a84b9c9482f9ab26e32f5044eef";
const clientSecret = "fb9e701a44de4c13af5f42665cd8bc68";
const ulElement = document.querySelector(".playlist-box");
const liElement = ulElement.querySelectorAll("li");
const videoURLs = [
  "./video/beach.mp4",
  "./video/rain.mp4",
  "./video/snow.mp4",
  "./video/night.mp4",
  "./video/ocean.mp4",
  "./video/waterfall.mp4",
  "./video/windy.mp4",
  "./video/birdsg.mp4",
];

function obtainRandomVideos(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
function reloadVideosOnScreen() {
  const videoElement = document.querySelector(".video");
  const videoSource = document.getElementById("video-source");
  const randomVideoURL = obtainRandomVideos(videoURLs);
  if (videoElement && videoSource) {
    videoSource.src = randomVideoURL;
    videoElement.load();
  }
}

/*Search Button*/
function searchBtn() {
  const inputValue = input.value;
  inputMoviment(inputValue);
}
function inputMoviment(inputValue) {
  const visibility = input.style.visibility;
  inputValue && searchCity(inputValue);
  visibility === "hidden" ? openInput() : closeInput();
}

function closeInput() {
  input.style.visibility = "hidden";
  input.style.width = "40px";
  input.style.padding = "0.5rem 0.5rem 0.5rem 2.6rem";
  input.style.transition = "all 0.5s easy-in-out 0s";
  input.value = "";
}

function openInput() {
  input.style.visibility = "visible";
  input.style.width = "300px";
  input.style.padding = "0.5rem 0.5rem 0.5rem 3.1rem";
  input.style.transition = "all 0.5s easy-in-out 0s";
  input.value = "";
}
function showEnvelope() {
  document.querySelector(".envelope").style.visibility = "visible";
  document.querySelector(".box").style.alignItems = "end";
  document.querySelector(".search").style.position = "initial";
}

input.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    const inputValue = input.value;
    inputMoviment(inputValue);
  }
});
document.addEventListener("DOMContentLoaded", () => {
  closeInput();
  reloadVideosOnScreen();
});

/*Weather Box*/
async function searchCity(city) {
  try {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
    );
    if (data.status === 200) {
      const result = await data.json();
      obtainTopAlbunsPerCountry(result.sys.country);
      showTemperature(result);
      showEnvelope();
      reloadVideosOnScreen();
    } else {
      throw new Error();
    }
  } catch {
    alert("Failure to search the city");
  }
}
function showTemperature(result) {
  document.querySelector(
    ".weather-icon"
  ).src = `./assets/${result.weather[0].icon}.png`;
  document.querySelector(".city-name").innerHTML = `${result.name}`;
  document.querySelector(
    ".temperature"
  ).innerHTML = `${result.main.temp.toFixed(0)}ºC`;
  document.querySelector(
    ".maxTemperature"
  ).innerHTML = `max:${result.main.temp_max.toFixed(0)}ºC`;
  document.querySelector(
    ".minTemperature"
  ).innerHTML = `min:${result.main.temp_min.toFixed(0)}ºC`;
}
/*Music Box*/
async function obtainAccessToken() {
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = btoa(credentials);
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  return data.access_token;
}
function obtainCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const mounth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  return `${year}-${mounth}-${day}`;
}

async function obtainTopAlbunsPerCountry(country) {
  try {
    const accessToken = await obtainAccessToken();
    const updateDate = obtainCurrentDate();
    const url = `https://api.spotify.com/v1/browse/featured-playlists?country=${country}&timestamp=${updateDate}T09%3A00%3A00&limit=3`;
    const results = await fetch(`${url}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (results.status === 200) {
      const data = await results.json();
      const printMusic = data.playlists.items.map((item) => ({
        name: item.name,
        image: item.images[0].url,
      }));
      showPlaylist(printMusic);
    } else {
      throw new Error();
    }
  } catch {
    alert("Failure to search a Playlist");
  }
}

function showPlaylist(data) {
  liElement.forEach((liElement, index) => {
    const imgElement = liElement.querySelector("img");
    const pElement = liElement.querySelector("p");
    imgElement.src = data[index].image;
    pElement.textContent = data[index].name;
  });
  document.querySelector(".playlist-box").style.visibility = "visible";
}
