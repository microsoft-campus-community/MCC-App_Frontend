import dotenv from "dotenv";
dotenv.config();

const config = {
	clientId: process.env.CLIENT_ID || "",
	clientSecret: process.env.CLIENT_SECRET || "",
	tenantId: process.env.TENANT_ID || "",
	baseUrl: process.env.BASE_URL || "",
	redirectUrl: process.env.REDIRECT_URL || "",
	scope: process.env.SCOPE || "",
	cookieSecret: process.env.COOKIESECRET || "",
	systemUser: process.env.SYSTEMUSERID || ""
}

export default config;