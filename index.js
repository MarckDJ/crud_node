const express = require("express");
const app = express();
const routes1 = require("./routes/main.routes");
const routes2 = require("./routes/crud.routes");
const morgan = require("morgan");
const session = require("express-session");
const Parser = require("body-parser").urlencoded({ extended: false });

app.set("host", 8080);
app.set("view engine", "pug");
app.set("views", "./views");

app.use(morgan("dev"));
app.use(Parser);
app.use("/public", express.static("public"));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: "V5p6-?>wh.j(",
        cookie: { maxAge: 60000 * 60 * 24 },
    })
);
app.use(routes1);
app.use(routes2);
app.use((req, res) => {
    res.status(400);
    res.render("404");
});

app.use((error, req, res, next) => {
    res.status(500);
    res.render("500", { error: error });
});

app.listen(app.get("host"), (req, res) => {
    console.log("Servidor en puerto: " + app.get("host"));
});
