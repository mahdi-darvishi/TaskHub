import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/auth-context";
// import { Outlet } from "react-router";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <Button onClick={logout}>Logout</Button>
      {/* <Outlet /> */}
    </div>
  );
};

export default DashboardLayout;
