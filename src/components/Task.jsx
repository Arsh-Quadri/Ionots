import { useState, useEffect } from "react";
import { db } from "../firebase"; // Import Firestore and Auth instances
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

const Task = () => {
  const [tasks, setTasks] = useState([]); // List of tasks
  const [users, setUsers] = useState([]); // List of users
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const [selectedTask, setSelectedTask] = useState(null); // Selected task for editing
  const [newTask, setNewTask] = useState(""); // New task input
  const [assignedTo, setAssignedTo] = useState(""); // Assigned to input
  const [description, setDescription] = useState(""); // Description input

  // Fetch tasks with real-time updates
  useEffect(() => {
    const tasksCollection = collection(db, "tasks");
    const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        await onSnapshot(usersCollection, (snapshot) => {
          const usersList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(usersList);
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch user data.");
      }
    };
    fetchUsers();
  }, []);

  // Add a new task to Firestore
  const addTask = async () => {
    if (!newTask) return alert("Task name is required!");
    try {
      const assignedUser = users.find((user) => user.name === assignedTo);
      const taskData = {
        task: newTask,
        assignedTo: assignedTo || null,
        assignedEmail: assignedUser ? assignedUser.email : null,
        description: description || "",
        complete: "",
        accept: "",
      };
      const docRef = await addDoc(collection(db, "tasks"), taskData);
      setTasks((prev) => [...prev, { id: docRef.id, ...taskData }]);
      closeModal();
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  // Update an existing task
  const updateTask = async () => {
    if (!selectedTask) return;
    try {
      const assignedUser = users.find((user) => user.name === assignedTo);
      const taskDoc = doc(db, "tasks", selectedTask.id);
      const updatedTask = {
        task: newTask,
        assignedTo: assignedTo || null,
        assignedEmail: assignedUser ? assignedUser.email : null,
        description: description || "",
      };
      await updateDoc(taskDoc, updatedTask);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === selectedTask.id ? { ...task, ...updatedTask } : task
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Open modal for adding or editing a task
  const openModal = (task = null) => {
    setSelectedTask(task);
    if (task) {
      setNewTask(task.task);
      setAssignedTo(task.assignedTo || "");
      setDescription(task.description || "");
      setIsEditing(true);
    } else {
      setNewTask("");
      setAssignedTo("");
      setDescription("");
      setIsEditing(false);
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setNewTask("");
    setAssignedTo("");
    setDescription("");
    setSelectedTask(null);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={() => openModal()}
      >
        Add New Task
      </button>

      {/* Task List */}
      <div className="mt-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border p-4 rounded-md mb-2 flex flex-col gap-2"
          >
            <h2 className="font-bold text-lg">{task.task}</h2>
            <p>Assigned To: {task.assignedTo || "Not Assigned"}</p>
            {/* <p>Assigned Email: {task.assignedEmail || "N/A"}</p> */}
            <p>Description: {task.description}</p>
            <p>Status: {task.complete == "yes" ? "Completed" : "Pending..."}</p>
            <p>
              Project:{" "}
              {task.accept == "yes"
                ? "Accepted"
                : task.accept == "no"
                ? "Rejected"
                : "Pending.."}
            </p>
            <div className="flex gap-4">
              <button
                className="bg-yellow-500 text-white px-4 py-1.5 rounded-md"
                onClick={() => openModal(task)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-1.5 rounded-md"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Task" : "Add New Task"}
            </h2>
            <input
              type="text"
              className="border w-full p-2 mb-4 rounded-md"
              placeholder="Task Name"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <textarea
              className="border w-full p-2 mb-4 rounded-md"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="border w-full p-2 mb-4 rounded-md"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Not Assigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={isEditing ? updateTask : addTask}
              >
                {isEditing ? "Save Changes" : "Add Task"}
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
