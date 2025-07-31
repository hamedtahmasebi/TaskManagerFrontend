import { useAuthStore } from "~/features/auth/store";
import { Configuration } from "./generated";
import { AuthApi, TaskApi, TeamApi } from "./generated/apis";

const config: Configuration = new Configuration({
    headers: {
        authorization: `Bearer ${useAuthStore.getState().accessToken ?? ""}`,
    },
    basePath: "http://localhost:5010",
});

export const Api = {
    Auth: new AuthApi(config),
    Task: new TaskApi(config),
    Team: new TeamApi(config),
};
