import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const UserTasks = () => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const tasksRef = collection(db, "tasks");

    // Real-time listener for tasks
    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      {/* Task List */}
      <div className="mt-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border p-4 rounded-md mb-2 flex flex-col gap-2"
          >
            <h2 className="font-bold text-lg">{task.task}</h2>
            <p>Assigned To: {task.assignedTo || "Not Assigned"}</p>
            <p>Description: {task.description}</p>
            <p>Status: {task.complete ? "Complete" : "Incomplete"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTasks;
