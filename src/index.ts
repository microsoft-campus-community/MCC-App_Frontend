import express from "express";
import path from "path";
import dotenv from "dotenv";

const app = express();

app.use(express.static(path.join(__dirname,"..","static")));
app.set("view engine", "ejs");

dotenv.config();

app.get("/", (req,res) => {
	res.render(path.join(__dirname,"..","pages","shell.ejs"), {
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

app.listen(process.env.PORT || 8000, () => {
	console.info("Server is running! (Default port:8000)");
})