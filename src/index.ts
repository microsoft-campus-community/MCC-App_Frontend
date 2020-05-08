import express from "express";
import path from "path";
import session from "express-session";
import bodyParser from "body-parser";
import appInsights = require("applicationinsights");

import config, { executionContext } from "./config";
import { userCache, campusCache, hubCache } from "./modules/cache/controller/cacheObjects";
import { _User } from "./modules/cache/models/user";
import { apiRouter, authRouter } from "./modules/endpoints/controller/router";
import siteRouter from "./modules/views/router";

if(config.executionContext === executionContext.Production)
appInsights.setup(config.appInsightsKey)
    .setAutoCollectConsole(true, true)
    .start();

const app = express();
app.use(express.static(path.join(__dirname, "..", "static")));
app.set("view engine", "ejs");

app.use(session({
    secret: config.cookieSecret,
    resave: false,
    saveUninitialized: true
}));

app.use("/auth", authRouter);

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
        hubCache.init().then(() => {
            app.listen(process.env.PORT || 8000, () => {
                console.info("Server is running! (Default port:8000)");
            })
        })
    })
})

