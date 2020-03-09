import express from "express";
import path from "path";

import { userCache, campusCache } from "../cache/cache";
import { _User } from "../models/database/user";

const siteRouter = express.Router();

siteRouter.get("/", (req, res) => {
	res.render(site("dashboards/userDashboard"), {
		permissions: {
			lead: true,
			admin: true
		},
		user: {
			Name: "Tobias Urban",
			Campus: "Microsoft",
			"Preferred name": "Tobi",
			Projects: "3",
			Events: "6",
			"Current position": "Member"
		}
	});
})
siteRouter.get("/leads", async (req, res) => {
	let user: _User | undefined = req.session ? await userCache.get(req.session.session) : undefined;
	if (!user) {
		res.status(403).send();
		return;
	}

	let campus = user.campus;
	if (!campus) {
		res.status(403).send("Lead has no campus attached or campus does not exist!");
		return;
	}
	let campusMembers:Array<_User> = [];
	campus.memberIds.forEach(async id => {
		let user = await userCache.get(id);
		if(!user) {
			res.status(403).send("At least one user listed for the campus does not exist!");
			return;
		}
		campusMembers.push();
	})
	res.render(site("dashboards/leadDashboard"), {
		admin: {
			campus: campusCache.getCampusNames()
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
			{
				id: "234-rwdr-5oi3",
				name: "Tobias Urban",
				applicationDate: "20.02.2019"
			},
			{
				id: "234-rwdr-5oi3",
				name: "Felix Schober",
				applicationDate: "13.11.2019"
			},
			{
				id: "234-rwdr-5oi3",
				name: "Newly added member with long name",
				applicationDate: "12.01.2020"
			}
		],
		//TODO get events for campus
		plannedEvents: [
			{
				id: "234-rwdr-5oi3",
				name: "Superhack",
				eventDate: "15.03.2020"
			},
			{
				id: "234-rwdr-5oi3",
				name: "AI Workshop",
				eventDate: "01.04.2020"
			}
		]
	});
})


siteRouter.get("/users/:id", (req, res) => {
	let user = req.params.id;
	res.render(site("profiles/userProfile"), {
		admin: {
			campus: [{ name: "Munich" }, { name: "Stuttgart" }, { name: "Hamburg" }, { name: "Köln" }, { name: "Frankfurt" }]
		},
		permissions: {
			lead: true,
			admin: false
		},
		user: {
			Name: "Tobias Urban",
			campus: "Microsoft",
			"Preferred name": "Tobi",
			Projects: "3",
			Events: "6",
			"Current position": "Member"
		},
		joinedDate: "24.01.2020",
		name: "Example User",
		campus: "Munich",
		plannedEvents: [{
			name: "Awesome hack",
			eventDate: "18.03.2020",
			id: "123-342-gds42"
		}],
		completedEvents: [{
			name: "Retro hack",
			eventDate: "18.01.2020",
			id: "123-342-gds42"
		}, {
			name: "AI Workshop",
			eventDate: "18.03.2019",
			id: "123-342-gds42"
		}],
		plannedProjects: [{
			title: "World-saving ultra awesome app that is as great as the name is long"
		}, { title: "Tinder for cats" },
		{ title: "MCC internal app" }],
		completedProjects: [],
		projectCount: 3,
		eventCount: 4,
	})
})
siteRouter.get("/events/:id", (req, res) => {
	res.render(site("profiles/eventProfile"));
})
siteRouter.get("/applications/:id", (req, res) => {
	res.render(site("profiles/applicationProfile"));
})
siteRouter.get("/projects/:id", (req, res) => {
	res.render(site("profiles/projectProfile"));
})

const sites = path.join(__dirname, "..", "..", "pages", "sites");
function site(siteName: string): string {
	return path.join(sites, siteName + ".ejs");
}

export default siteRouter;