const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());

const userData = [];

// Enable CORS for all routes
app.use(cors());

app.post("/userdata", (req, res) => {
  const { uid, displayName, type, focusingPercentage, peerId } = req.body;
  console.log(
    `Received data for user ${displayName} (${uid}), focusingPercentage: ${focusingPercentage}, peerId: ${peerId}`
  );

  const userIndex = userData.findIndex((user) => user.uid === uid);
  if (userIndex !== -1) {
    // Update the existing user's focusingPercentage and peerId
    userData[userIndex].focusingPercentage = focusingPercentage;
    userData[userIndex].peerId = peerId;
  } else {
    // Create a new user object if it doesn't exist
    userData.push({
      uid,
      displayName,
      type,
      focusingPercentage,
      peerId,
    });
    
  }

  console.log(userData);
  res.sendStatus(200);
});

app.get("/userdata", (req, res) => {
  if (userData.length === 0) {
    res.sendStatus(404);
  } else {
    res.json(userData);
  }
});

app.listen(3002, () => {
  console.log("Server listening on port 3002");
});
