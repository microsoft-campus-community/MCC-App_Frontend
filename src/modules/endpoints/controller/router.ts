import express from "express";

import { getRedirectUrlToLogin, completeLogin } from "./userAuth";
import config from "../../../config";

import request from "request";

import { userCache } from "../../cache/controller/cacheObjects";
import { _User } from "../../cache/models/user";
import { PeopleEngine } from "../../database/controllers/peopleEngineRequests";
import { postIdea } from "./api";

export const authRouter = express.Router();
export const apiRouter = express.Router();

authRouter.get("/login", (req, res) => {
    let state = req.query.origin || "";
    res.redirect(getRedirectUrlToLogin(state));
})

authRouter.get(config.redirectUrl, async (req, res) => {
    const authCode = req.query.code;
    let userId = await completeLogin(authCode);
    if (userId === "") {
        res.status(500).send("Your login could not be successfully completed. Please contact the app developers for support!");
    }
    else {
        if (req.session) req.session.session = userId;
        req.query.state ? res.redirect(req.query.state) : res.redirect("/");
    }
})

apiRouter.post("/idea", async (req, res) => {
    if (!req.body.summary) {
        res.status(400).send("Required parameters missing! Provide at least summary");
        return;
    }
    else {
        let user: _User | undefined = req.session ? await userCache.get(req.session.session) : undefined;
        if (user) {
            let successfulIdeaSubmission: boolean = false;
            req.body.personal === "true" ?
                successfulIdeaSubmission = await postIdea(user, req.body.summary, req.body.details, true) :
                successfulIdeaSubmission = await postIdea(user, req.body.summary, req.body.details, false);

            successfulIdeaSubmission?
            res.send("Successful!"):
            res.status(500).send("Could not send idea!");
        }
        else res.status(403).send("User was not found in system!");
    }
})

apiRouter.post("/users", async (req, res) => {
    if (!req.body.first || !req.body.last || !req.body.mail) {
        res.status(400).send("Required parameters missing! Provide: first,last,mail");
        return;
    }
    else {
        await new Promise(async resolve => {
            let currentUser: _User | undefined;
            if (req.session) {
                currentUser = await userCache.get(req.session.session);
            }
            else {
                res.status(403).send("User is not signed in!");
                return;
            }
            if (currentUser && currentUser.token) {
                if (currentUser.campus || req.body.campus) {
                    PeopleEngine.createUser(currentUser.token, {
                        firstName: req.body.first,
                        lastName: req.body.last,
                        secondaryMail: req.body.mail,
                        campusId: req.body.campus || currentUser.campus
                    })
                }
                else {
                    res.status(400).send("Could not find campus for user to be created in!");
                    return;
                }
            }
            else {
                res.status(403).send("User is not signed in!");
                return;
            }
        })
    }
})
