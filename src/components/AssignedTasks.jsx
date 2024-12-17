import { useState, useEffect, useContext } from "react";
import { db } from "../firebase"; // Import Firebase auth and Firestore
import {
  collection,
  doc,
  increment,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../AuthContext";

const AssignedTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]); // All tasks
  const [assignedTasks, setAssignedTasks] = useState([]); // Tasks assigned to the current user

  // Fetch tasks from Firestore in real-time
  useEffect(() => {
    const tasksRef = collection(db, "tasks");

    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Filter tasks assigned to the current user
  useEffect(() => {
    if (user?.email) {
      const filteredTasks = tasks.filter(
        (task) => task.assignedEmail === user?.email
      );
      setAssignedTasks(filteredTasks);
    }
  }, [user, tasks]);

  // Update Firestore for accept/reject or complete
  const handleUpdateTask = async (taskId, field, value) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { [field]: value });
      if (field === "complete" && value === "yes") {
        const userRef = doc(db, "users", user?.uid); // Assuming users are stored with email as ID
        await updateDoc(userRef, { score: increment(5) }); // Increment score by 5
      }
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, [field]: value } : task
        )
      );
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assigned Tasks</h1>

      {assignedTasks.length > 0 ? (
        <div>
          {assignedTasks.map((task) => (
            <div
              key={task.id}
              className="border p-4 rounded-md mb-4 flex flex-col gap-2"
            >
              <h2 className="font-bold text-lg">{task.task}</h2>
              <p>Description: {task.description || "No description"}</p>
              <p>Status: {task.complete ? "Complete" : "Incomplete"}</p>
              <p>
                Accepted:{" "}
                {task.accept === ""
                  ? "Not decided"
                  : task.accept == "yes"
                  ? "Yes"
                  : "No"}
              </p>

              {/* Accept and Reject Buttons */}
              {task.accept === "" && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleUpdateTask(task.id, "accept", "yes")}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateTask(task.id, "accept", "no")}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Completed Button (Visible only if task is accepted) */}
              {task.accept === "yes" && task.complete != "yes" && (
                <button
                  onClick={() => handleUpdateTask(task.id, "complete", "yes")}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-fit"
                >
                  {/* Mark as {task.complete == "yes" ? "Incomplete" : "Completed"} */}
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </div>
  );
};

export default AssignedTasks;
