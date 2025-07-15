import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <div className="grid grid-cols-2 w-screen h-screen">
            <div className="col-span-2 md:col-span-1 md:mx-auto flex flex-col py-4 px-6 justify-center">
                <Outlet />
            </div>
            <div className="hidden col-span-1 md:flex flex-col bg-primary" />
        </div>
    );
}
