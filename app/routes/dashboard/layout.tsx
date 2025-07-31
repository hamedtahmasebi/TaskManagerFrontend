import { Outlet } from "react-router";
import LayoutSidebar from "~/components/layout/Sidebar";

export default function DashboardLayout() {
    return (
        <div className="flex">
            <div className="">
                <LayoutSidebar />
            </div>
            <div className="flex-1 p-4">
                <Outlet />
            </div>
        </div>
    );
}
