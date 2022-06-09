const store = {
  user: { name: "Martian Lovers" },
  photos: {},
  rovers: ["Curiosity", "Opportunity", "Spirit"],
};

// add our markup to the page
const root = document.getElementById("root");

//Add Base URL
const BASE_URL = "https://mars-rover-ialkamal.herokuapp.com";

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
  document.getElementById("default").click();
};

// create content
const App = (state) => {
  const { photos, user, rovers } = state;
  let input = Immutable.Map({ html: ``, obj: {} });

  return `
        <header></header>
        <main>
            ${Greeting(user.name)}
            <section>
                <h3>Checkout the latest photos from Mars!</h3>
                <p>
                Mars has captivated humans since we first set eyes on it as a star-like object in the night sky. Early on, its reddish hue set the planet apart from its shimmering siblings, each compelling in its own way, but none other tracing a ruddy arc through Earth’s heavens. Then, in the late 1800s, telescopes first revealed a surface full of intriguing features—patterns and landforms that scientists at first wrongly ascribed to a bustling Martian civilization. Now, we know there are no artificial constructions on Mars. But we’ve also learned that, until 3.5 billion years ago, the dry, toxic planet we see today might have once been as habitable as Earth.
                </p>
                <p>
                Since the 1960s, humans have set out to discover what Mars can teach us about how planets grow and evolve, and whether it has ever hosted alien life. So far, only uncrewed spacecraft have made the trip to the red planet, but that could soon change. NASA is hoping to land the first humans on Mars by the 2030s—and several new missions are launching before then to push exploration forward. Here’s a look at why these journeys are so important—and what humans have learned about Mars through decades of exploration.
                </p>
                <div class="tab">
                ${rovers
                  .map((name) => {
                    return `<button class="tablinks" onclick="openTab(event)" id=${
                      name === "Curiosity" ? "default" : ""
                    }>${name}</button>`;
                  })
                  .join("")}
                </div>
                ${rovers
                  .map((rover) => {
                    if (photos && Object.keys(photos).length !== 0) {
                      return `<div id=${rover} class="tabcontent"> 
                    ${RoverDetails(
                      PhotoGallery(
                        input.set("obj", photos[rover]),
                        generateImageGallery
                      ),
                      generateRoverInfoList
                    ).get("html")}
                    </div>`;
                    } else {
                      return `<div id=${rover} class="tabcontent">
                   <p>Loading...</p>
                    </div>`;
                    }
                  })
                  .join("")} 
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
  getImagesFromRovers(store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

const generateRoverInfoList = (info) => {
  const div = document.createElement("div");
  div.classList = "rover-info";
  div.innerHTML = `
  <ul>
  <li><b>Rover Name:</b> ${info?.name}</li>
  <li><b>Launch Date:</b> ${info?.launch_date}</li>
  <li><b>Landing Date:</b> ${info?.landing_date}</li>
  <li><b>Status:</b> ${info?.status}</li>
  <li><b>Date of Latest Photos:</b> ${info?.most_recent_photos_date}</li>
  <li><b>Number of Photos:</b> ${info?.most_recent_photos_qty}</li>
  </ul>`;

  return div.outerHTML;
};

// 1st higher order function
const RoverDetails = (input, ulFunction) => {
  const rover = input.get("obj");
  const previousHTML = input.get("html");
  const currentHTML = ulFunction(rover.info);
  const output = input.set("html", currentHTML + previousHTML);
  return output;
};

const generateImageGallery = (photos) => {
  const div = document.createElement("div");
  photos?.map((photo) => {
    const img = document.createElement("img");
    img.src = photo.img_src;
    div.appendChild(img);
  });
  return div.outerHTML;
};

// 2nd higher order function
const PhotoGallery = (input, galleryFunction) => {
  const rover = input.get("obj");
  const previousHTML = input.get("html");
  const currentHTML = galleryFunction(rover.photos);
  const output = input.set("html", currentHTML + previousHTML);
  return output;
};

//Tab Code src: w3schools url:https://www.w3schools.com/howto/howto_js_tabs.asp
function openTab(evt) {
  const tabName = evt.target.textContent;

  // Declare all variables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "flex";
  evt.currentTarget.className += " active";
}

// ------------------------------------------------------  API CALLS

// Get Images from Rover
const getImagesFromRovers = (state) => {
  const { rovers } = state;

  const rover_photos = {};
  const promises = rovers.map((name) => {
    return fetch(`${BASE_URL}/rover/${name}`)
      .then((res) => res.json())
      .then(({ photos }) => {
        rover_photos[`${name}`] = {
          info: {
            ...photos[0]?.rover,
            most_recent_photos_qty: photos.length,
            most_recent_photos_date: photos[0]?.earth_date,
          },
          photos,
        };
      })
      .catch((err) => {
        console.log("Error fetching from the NASA API ", err);
      });
  });

  Promise.all(promises).then(() => {
    updateStore(store, { photos: rover_photos });
  });
};
