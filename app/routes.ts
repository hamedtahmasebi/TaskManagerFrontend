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

    layout("./routes/dashboard/layout.tsx", [
        route("dashboard", "routes/dashboard/index.tsx"),
        route("dashboard/tasks", "routes/dashboard/tasks.tsx"),
    ]),
] satisfies RouteConfig;
