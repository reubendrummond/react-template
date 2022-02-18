require("dotenv").config();
const app = require("express")();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// allow requests from client
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));

const apiRouter = require("./controllers/api");

// routes routes
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.status(200).json({ data: "root" });
});

// error handling
const ErrorHandler = require("./middleware/ErrorHandler");
app.use(ErrorHandler.logError);
app.use(ErrorHandler.sendError);
app.use(ErrorHandler.invalidPath);

const port = process.env.PORT || 6900;
app.listen(port, () => {
  console.log(
    `Listening on port ${port} in ${process.env.NODE_ENV} environment. \n ^+C to cancel.`
  );
});
