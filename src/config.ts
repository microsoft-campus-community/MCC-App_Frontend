import dotenv from "dotenv";
dotenv.config();
export enum executionContext {
    Production= "prod",
    Development = "dev",
    Testing = "test"
}

const config = {
	clientId: process.env.CLIENT_ID || "",
	clientSecret: process.env.CLIENT_SECRET || "",
	tenantId: process.env.TENANT_ID || "",
	baseUrl: process.env.BASE_URL || "",
	redirectUrl: process.env.REDIRECT_URL || "",
	scope: process.env.SCOPE || "",
	cookieSecret: process.env.COOKIESECRET || "",
    systemUser: process.env.SYSTEMUSERID || "",
    appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || "",
    executionContext: process.env.EXECUTIONCONTEXT || "dev"
}

config.executionContext === "prod" ? config.executionContext = executionContext.Production :
config.executionContext === "dev" ? config.executionContext = executionContext.Development :
config.executionContext === "test" ? config.executionContext = executionContext.Testing :
console.error("Execution Context is not specified! Defaulting to Development environment");


export default config;
