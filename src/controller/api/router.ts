import express from "express";

const apiRouter = express.Router();

apiRouter.post("/users", async (req,res) => {
	if(!req.body.first || !req.body.last || !req.body.mail) {
		res.status(400).send("Required parameters missing! Provide: first,last,mail");
		return;
	}
	else {
		await new Promise(resolve => {
			setTimeout(() => {
				res.status(201).send();
				resolve();
			}, 2000);
		})
	}
})

export default apiRouter;