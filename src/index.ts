import express from "express";
import path from "path";
import session from "express-session";
import bodyParser from "body-parser";

import config from "./config";
import loginApi from "./controller/auth/authApi";
import {userCache} from "./controller/cache/cache";
import { _User } from "./models/database/user";
import apiRouter from "./controller/api/router";
import siteRouter from "./views/router";


const app = express();
app.use("/static",express.static(path.join(__dirname, "..", "static")));
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


app.listen(process.env.PORT || 8000, () => {
	console.info("Server is running! (Default port:8000)");
})