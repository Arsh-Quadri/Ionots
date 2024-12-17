import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import UserTasks from "./UserTasks";
import AssignedTasks from "./AssignedTasks";

const UserDashboard = () => {
  const [component, setcomponent] = useState("task");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redirect to login after logout
  };
  return (
    <div className="mx-auto flex justify-center items-center">
      <div className="max-w-[1080px] w-full">
        <div className="flex justify-between px-5 mt-2">
          <div className="flex gap-3">
            <div
              className={`font-medium text-gray-800 px-5 py-1.5 ${
                component == "task" ? "bg-gray-300" : ""
              } rounded-md cursor-pointer`}
              onClick={() => setcomponent("task")}
            >
              All Tasks
            </div>
            <div
              className={`font-medium text-gray-800 px-5 py-1.5 ${
                component == "leaderboard" ? "bg-gray-300" : ""
              } rounded-md cursor-pointer`}
              onClick={() => setcomponent("leaderboard")}
            >
              Assigned Tasks
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-1.5 w-fit h-fit font-medium rounded-md hover:bg-red-600 cursor-pointer"
          >
            Logout
          </button>
        </div>
        <hr className="mt-3 border-t-2 bg-black" />
        {component == "task" ? <UserTasks /> : <AssignedTasks />}
      </div>
    </div>
  );
};

export default UserDashboard;
