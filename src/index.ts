import express from "express";
import path from "path";
import session from "express-session";
import bodyParser from "body-parser";

import config from "./config";
import loginApi from "./modules/api/controller/auth/authApi";
import { userCache, campusCache } from "./modules/cache/controller/cacheObjects";
import { _User } from "./modules/cache/models/user";
import apiRouter from "./modules/api/controller/api/router";
import siteRouter from "./modules/views/router";


const app = express();
app.use(express.static(path.join(__dirname, "..", "static")));
app.set("view engine", "ejs");

app.use(session({
    secret: config.cookieSecret,
    resave: false,
    saveUninitialized: true
}));

app.use("/auth", loginApi);

app.use(async (req, res, next) => {
    if (req.session && req.session.session) {
        if (await userCache.get(req.session.session)) {
            next();
            return;
        }
    }
    res.redirect("/auth/login?origin=" + req.originalUrl);
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use("/", siteRouter);

userCache.init().then(() => {
    campusCache.init().then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.info("Server is running! (Default port:8000)");
        })
    })
})

