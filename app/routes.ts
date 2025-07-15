import {
    type RouteConfig,
    index,
    route,
    layout,
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("./routes/auth/layout.tsx", [
        route("auth/login", "routes/auth/login.tsx"),
        route("auth/signup", "routes/auth/signup.tsx"),
    ]),
] satisfies RouteConfig;
