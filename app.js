const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");

//Load Config
dotenv.config({ path: "./config/config.env" });

const app = express();
connectDB();
//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method Overriding
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//SESSIONS
app.use(
  session({
    secret: "dell",
    resave: false,
    saveUninitialized: false,
  })
);

//Passport Config
require("./config/passport")(passport);

//logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//handlebars helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");
//handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
const PORT = process.env.PORT || 3000;

//Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//STATIC Folders
app.use(express.static(path.join(__dirname, "public")));
// Set Global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// ROUTES
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));
app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV}mode on port ${PORT}`)
);
