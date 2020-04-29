import { _User } from "../../cache/models/user";
import config from "../../../config";
import { getSystemToken } from "./systemAuth";
import request from "request";

/**
 *
 * @param user
 * @param summary
 * @param details
 * @param personalized
 * @returns boolean success indicator.
 */
export async function postIdea(user: _User, summary: string, details: string, personalized: boolean): Promise<boolean> {
    return new Promise(async resolve => {
        let mailBody = "";
        let queryUrl = "";
        if (personalized === true) {
            mailBody += user.name + " ";
            queryUrl = "https://graph.microsoft.com/v1.0/users/" + user.id + "/sendMail";
        }
        else {
            mailBody += "Someone ";
            queryUrl = "https://graph.microsoft.com/v1.0/users/" + config.systemUser + "/sendMail";
        }
        mailBody += `had an idea for the commasto app!
		In a nutshell: ${summary}
		Details:
		${details}`;

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
            if (!error) resolve(true);
            else {
                console.error(error);
                resolve(false);
            }
        })
    })
}
