import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
