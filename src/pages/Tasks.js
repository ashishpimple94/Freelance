import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [taskInput, setTaskInput] = useState("");
  const [form, setForm] = useState({
    project: "",
    taskList: [],
    priority: "Medium",
    deadline: "",
    status: "Pending",
  });

  // Load from backend
  useEffect(() => {
    loadTasks();
    loadProjects();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      const safeTasks = (Array.isArray(data) ? data : []).map((task) => ({
        ...task,
        taskList: task.taskList || [],
      }));
      setTasks(safeTasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setTasks([]);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setProjects([]);
    }
  };

  const openAddModal = () => {
    setForm({
      project: "",
      taskList: [],
      priority: "Medium",
      deadline: "",
      status: "Pending",
    });
    setEditIndex(null);
    setTaskInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    setForm({
      ...tasks[index],
      taskList: tasks[index].taskList || [],
    });
    setEditIndex(index);
    setTaskInput("");
    setIsModalOpen(true);
  };

  const addTaskToList = () => {
    if (!taskInput.trim()) return;
    setForm({
      ...form,
      taskList: [...form.taskList, taskInput.trim()],
    });
    setTaskInput("");
  };

  const removeTaskFromList = (idx) => {
    const updated = form.taskList.filter((_, i) => i !== idx);
    setForm({ ...form, taskList: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.project) return alert("Please select a project");
    if (form.taskList.length === 0) return alert("Add at least one task");

    try {
      if (editIndex !== null) {
        const task = tasks[editIndex];
        await api.updateTask(task._id, form);
        setEditIndex(null);
      } else {
        await api.createTask(form);
      }

      await loadTasks();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save task: " + err.message);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this task group?")) return;
    
    try {
      const task = tasks[index];
      await api.deleteTask(task._id);
      await loadTasks();
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.project.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Website Tasks</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>+</span> Add New Tasks
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by project name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Project</th>
              <th className="p-3">Tasks</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No tasks found. Add some using the button above.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{task.project}</td>
                  <td className="p-3">
                    {task.taskList.length === 0 ? (
                      "—"
                    ) : (
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {task.taskList.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-3">{task.deadline || "—"}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ──────────────────────────────────────────────
          MODAL
      ────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editIndex !== null ? "Edit Tasks" : "Add New Tasks"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900 text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Project */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="project"
                    value={form.project}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map((proj, i) => (
                      <option key={i} value={proj.website}>
                        {proj.website}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tasks */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tasks <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="Enter task title..."
                      className="border p-3 rounded-lg flex-1"
                    />
                    <button
                      type="button"
                      onClick={addTaskToList}
                      className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                    {form.taskList.length === 0 ? (
                      <p className="text-gray-400 text-sm italic">No tasks added yet</p>
                    ) : (
                      form.taskList.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-white p-2 mb-2 rounded border"
                        >
                          <span className="text-sm">{t}</span>
                          <button
                            type="button"
                            onClick={() => removeTaskFromList(idx)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Priority + Deadline + Status */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="border p-3 rounded-lg w-full"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Deadline</label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="border p-3 rounded-lg w-full"
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editIndex !== null ? "Update Tasks" : "Save Tasks"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Tasks;