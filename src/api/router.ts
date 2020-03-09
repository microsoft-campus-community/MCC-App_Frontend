import express from "express";

const apiRouter = express.Router();

apiRouter.post("/users", (req,res) => {
	if(!req.body.first || !req.body.last || !req.body.mail) {
		res.status(400).send("Required parameters missing! Provide: first,last,mail");
		return;
	}
	else {
		res.status(201).send();
	}
})

export default apiRouter;