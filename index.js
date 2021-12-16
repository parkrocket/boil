const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://parkrocket:4523105a@parkrocket.k2kwl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connet"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("안녕하세요 :)");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
