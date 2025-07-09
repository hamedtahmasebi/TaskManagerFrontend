import { Configuration } from "./generated";
import { AuthApi, TaskApi, TeamApi } from "./generated/apis";

const config: Configuration = new Configuration({
    headers: {
        authorization: localStorage.getItem("access_token") ?? "",
    },
});

export const Api = {
    Auth: new AuthApi(config),
    Task: new TaskApi(config),
    Team: new TeamApi(config),
};
