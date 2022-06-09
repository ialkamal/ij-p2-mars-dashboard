require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls
app.get("/rover/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const max_sol = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/${name}/?API_KEY=${process.env.API_KEY}`
    )
      .then((res) => res.json())
      .then((res) => res.photo_manifest.max_sol);

    const rover_photos = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?sol=${max_sol}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());

    res.status(200).send(rover_photos);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "The server failed to get the photos", stack: err });
  }
});

// example API call
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
