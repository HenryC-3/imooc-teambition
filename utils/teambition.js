/**
 * @todo 使用 teambition API 批量创建任务
 */
const { TWS } = require("tws-auth");

const client = new TWS({
	appId: process.env.APP_ID,
	appSecrets: [process.env.APP_SECRES],
	host: "https://open.teambition.com/api",
});
console.log(client.signAppToken());
