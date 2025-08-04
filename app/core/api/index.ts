import { useAuthStore } from "~/features/auth/store";
import { Configuration } from "./generated";
import { AuthApi, TaskApi, TeamApi } from "./generated/apis";

export class Api {
    static get Auth() {
        return new AuthApi(this.getConfig());
    }
    static get Task() {
        return new TaskApi(this.getConfig());
    }
    static get Team() {
        return new TeamApi(this.getConfig());
    }

    private static getConfig() {
        const config: Configuration = new Configuration({
            headers: {
                authorization: `Bearer ${
                    useAuthStore.getState().accessToken ?? ""
                }`,
            },
            basePath: "http://localhost:5010",
        });
        return config;
    }
}
