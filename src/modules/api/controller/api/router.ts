import express from "express";
import request from "request";

import { userCache } from "../../../cache/controller/cacheObjects";
import { getSystemToken } from "../auth/authUtil";
import { _User } from "../../../cache/models/user";
import config from "../../../../config";
import { PeopleEngine } from "../../../database/controllers/peopleEngineRequests";

const apiRouter = express.Router();

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


            setTimeout(() => {
                res.status(201).send();
                resolve();
            }, 2000);
        })
    }
})

apiRouter.post("/idea", async (req, res) => {
    if (!req.body.summary) {
        res.status(400).send("Required parameters missing! Provide at least summary");
        return;
    }
    else {
        let mailBody = "";
        let queryUrl = "";
        let user: _User | undefined = req.session ? await userCache.get(req.session.session) : undefined;
        if (req.body.personal === "true") {
            if (!user) {
                res.status(401).send("User not found!");
                return;
            }
            mailBody += user.name + " ";
            queryUrl = "https://graph.microsoft.com/v1.0/users/" + user.id + "/sendMail";
        }
        else {
            mailBody += "Someone ";
            queryUrl = "https://graph.microsoft.com/v1.0/users/" + config.systemUser + "/sendMail";
        }
        mailBody += `had an idea for the commasto app!
		In a nutshell: ${req.body.summary}
		Details:
		${req.body.details}`;

        let systemToken = await getSystemToken();
        const options = {
            method: "POST",
            url: queryUrl,
            headers: {
                Authorization: "Bearer " + systemToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "message": {
                    "subject": "New idea for Commasto",
                    "body": {
                        "contentType": "Text",
                        "content": mailBody
                    },
                    "toRecipients": [
                        {
                            "emailAddress": {
                                "address": "tobias.urban@campus-community.org"
                            }
                        }
                    ],
                },
                "saveToSentItems": "true"
            })
        };
        request(options, (error, response, body) => {
            if (!error) res.send();
            else {
                console.error(error);
                res.status(500).send();
            }
        })

    }
})

export default apiRouter;
