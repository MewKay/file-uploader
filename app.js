const express = require("express");
const app = express();

// General setup
const path = require("node:path");
const viewsPath = path.join(__dirname, "views");
const assetsPath = path.join(__dirname, "public");

app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

// Session setup and passport authentication
const session = require("./config/session");
const passport = require("passport");
app.use(session);
require("./config/passport");
app.use(passport.session());

// Middlewares setup
const flash = require("express-flash");
app.use(flash());

// Routes
const indexRouter = require("./routes/index.router");
const signUpRouter = require("./routes/sign-up.router");
const logInRouter = require("./routes/log-in.router");
const filesRouter = require("./routes/files.router");
const shareRouter = require("./routes/share.router");
const notFoundRoute = require("./middlewares/not-found-route");
const errorHandler = require("./middlewares/error-handler");
app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);
app.use("/log-in", logInRouter);
app.use("/files", filesRouter);
app.use("/share", shareRouter);

app.use(notFoundRoute);
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on PORT : ${PORT}`);
});
