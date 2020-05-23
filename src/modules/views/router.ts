import express from "express";
import path from "path";

import { userCache, campusCache } from "../cache/controller/cacheObjects";
import { _User } from "../cache/models/user";

const siteRouter = express.Router();

siteRouter.get("/", async (req, res) => {
	let user: _User | undefined = req.session ? await userCache.get(req.session.session) : undefined;
	if (!user) {
		res.status(403).send();
		return;
	}

	res.render(site("profiles/userProfile"), {
		admin: {
			campus: campusCache.getCampusNameObject()
		},
		permissions: {
			"lead": user.lead,
			"admin": user.admin
		},
		user: {
			name: user.name,
			campus: user.campus.name,
			projectCount: user.projectCount,
			eventCount: user.eventCount,
            position: user.position,
            joinedDate: "N/A",
		},
		joinedDate: "Coming soon!",
		name: user.name,
		campus: user.campus.name,
		plannedEvents: [
            /* {
			name: "Awesome hack",
			eventDate: "18.03.2020",
			id: "123-342-gds42"
        } */
    ],
		completedEvents: [
            /* {
			name: "Retro hack",
			eventDate: "18.01.2020",
			id: "123-342-gds42"
        } */
    ],
		plannedProjects: [
			//{ title: "World-saving ultra awesome app that is as great as the name is long" }
		],
		completedProjects: [],
		projectCount: 0,
		eventCount: 0,
	})
})
siteRouter.get("/leads", async (req, res) => {
	let user: _User | undefined = req.session ? await userCache.get(req.session.session) : undefined;
	if (!user) {
		res.status(403).send();
		return;
    }
    if(!user.lead) {
        res.status(403).send("This page is unfortunately only available for leads. Please head back to <a href='/'>the homepage</a>.");
        return;
    }
	let campus = user.campus;
	if (!campus) {
		res.status(403).send("Lead has no campus attached or campus does not exist!");
		return;
    }
	let campusMembers: Array<_User> = user.campus.members;
	res.render(site("dashboards/leadDashboard"), {
		admin: {
			campus: campusCache.getCampusNameObject()
		},
		permissions: {
			lead: user.lead,
			admin: user.admin
		},
		user: {
			Name: user.name,
			Campus: user.campus,
			"Preferred name": user.preferredName,
			Projects: user.projectCount,
			Events: user.eventCount,
			"Current position": user.position
		},
		members: campusMembers,
		applications: [
			/* {
				id: "234-rwdr-5oi3",
				name: "Tobias Urban",
				applicationDate: "20.02.2019"
			} */
		],
		//TODO get events for campus
		plannedEvents: [
			/* {
				id: "234-rwdr-5oi3",
				name: "Superhack",
				eventDate: "15.03.2020"
			} */
		]
	});
})
siteRouter.get("/me", async (req,res) => {
    let user: _User | undefined = req.session ? await userCache.get(req.session.session) : undefined;
	if (!user) {
		res.status(403).redirect("/auth/login");
		return;
    }
    res.render(site("dashboards/userDashboard"), {
		admin: {
			campus: campusCache.getCampusNameObject()
		},
		permissions: {
			"lead": user.lead,
			"admin": user.admin
		},
		user: {
			name: user.name,
			campus: user.campus.name,
			projectCount: user.projectCount,
			eventCount: user.eventCount,
            position: user.position,
            joinedDate: "N/A",
		},

		plannedEvents: [
            /* {
			name: "Awesome hack",
			eventDate: "18.03.2020",
			id: "123-342-gds42"
        } */
    ],
		completedEvents: [],
		plannedProjects: [
			//{ title: "World-saving ultra awesome app that is as great as the name is long" }
		],
		completedProjects: [],
		projectCount: 0,
		eventCount: 0,
	})
})

//TODO: Determine if user is still active (or e.g. Alumni)
//TODO: Handle dropout date (e.g. time of Alumnisation)
//TODO: Allow leads to add any text to certificate (e.g. under "Highlights" section)
//TODO: Allow member to highlight certain events that should be included
siteRouter.get("/me/certificate", async (req,res) => {
    let user: _User | undefined = req.session ? await userCache.get(req.session.session) : undefined;
	if (!user) {
		res.status(403).redirect("/auth/login");
		return;
    }
    res.render(site("artifacts/memberCertificate"), {
        user: user
    })
})

siteRouter.get("/users/:id", async (req, res) => {
	let userId = req.params.id;
	let user: _User | undefined = req.session ? await userCache.get(userId) : undefined;
	if (!user) {
		res.status(403).send();
		return;
	}
	res.render(site("profiles/userProfile"), {
		admin: {
			campus: campusCache.getCampusNameObject()
		},
		permissions: {
			"lead": user.lead,
			"admin": user.admin
		},
		user: {
			name: user.name,
			campus: user.campus.name,
			projectCount: user.projectCount,
			eventCount: user.eventCount,
            position: user.position,
            joinedDate: "N/A",
		},

		plannedEvents: [
            /* {
			name: "Awesome hack",
			eventDate: "18.03.2020",
			id: "123-342-gds42"
        } */
    ],
		completedEvents: [],
		plannedProjects: [
			//{ title: "World-saving ultra awesome app that is as great as the name is long" }
		],
		completedProjects: [],
		projectCount: 0,
		eventCount: 0,
	})
})


/* siteRouter.get("/events/:id", (req, res) => {
	res.render(site("profiles/eventProfile"));
})
siteRouter.get("/applications/:id", (req, res) => {
	res.render(site("profiles/applicationProfile"));
})
siteRouter.get("/projects/:id", (req, res) => {
	res.render(site("profiles/projectProfile"));
}) */

siteRouter.get("/offline", (req,res) => {
	res.render(site("dashboards/offlineDashboard"));
})

//Define and easily render paths to site templates
const sites = path.join(__dirname, "..", "..", "..", "pages", "sites");
function site(siteName: string): string {
	return path.join(sites, siteName + ".ejs");
}

export default siteRouter;
