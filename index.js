const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally
const path = require("path");
const cartRoute = require("./routes/cartRoute");
const userRoute = require("./routes/userRoute");
const productsRoute = require("./routes/productsRoute");

const app = express(); // Initialize express as an app variable
app.set("port", process.env.PORT || 7373); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Dont let local development give errors
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.sendFile(__dirname + "/index");
});

const staticPath = path.join(__dirname + "/public");
// app.use(express.static(staticPath));

// app.get("/", (req, res) => {
//   res.json({ msg: "Welcome" });
// });
app.get("/", function (req, res) {
  res.sendFile(staticPath + "/endpoint.html");
});

app.use("/products", productsRoute);

app.use("/users", userRoute);

app.use(cartRoute);

app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});
