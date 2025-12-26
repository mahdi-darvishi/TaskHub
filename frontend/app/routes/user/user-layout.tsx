import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <div className="flex h-screen w-full bg-background">
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
