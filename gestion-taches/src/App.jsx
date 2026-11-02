import { useState } from "react";
import { useLocalStorage } from "./hooks.js";
import TaskForm from "./components/TaskForm.jsx";
import TaskItem from "./components/TaskItem.jsx";
import Doughnut from "./components/Doughnut.jsx";
import { STATUSES, getStatus } from "./utils.js";

const FILTERS = ["toutes", "à faire", "en cours", "terminées"];
const FILTER_STATUS = { "à faire": "à faire", "en cours": "en cours", "terminées": "terminée" };

const norm = (s) =>
  (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function App() {
  const [tasks, setTasks] = useLocalStorage("taches-v1", []);
  const [filter, setFilter] = useState("toutes");
  const [search, setSearch] = useState("");

  const addTask = (data) =>
    setTasks([{ id: Date.now(), done: false, status: "à faire", ...data }, ...tasks]);

  const toggleTask = (id) =>
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done, status: t.done ? "à faire" : "terminée" } : t
      )
    );

  const changeStatus = (id, status) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status, done: status === "terminée" } : t)));

  const updateTask = (id, patch) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const clearDone = () => setTasks(tasks.filter((t) => !t.done));

  const doneCount = tasks.filter((t) => t.done).length;
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const counts = Object.fromEntries(STATUSES.map((st) => [st, tasks.filter((t) => getStatus(t) === st).length]));

  const q = norm(search.trim());
  const shown = tasks
    .filter((t) => filter === "toutes" || getStatus(t) === FILTER_STATUS[filter])
    .filter((t) => !q || norm(`${t.title} ${t.director}`).includes(q));

  return (
    <main>
      <h1>Mes tâches</h1>
      <p className="sub">
        {tasks.length
          ? `${doneCount} terminée(s) sur ${tasks.length}`
          : "Ajoutez votre première tâche pour commencer."}
      </p>

      <div className="bar" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
        <i style={{ width: `${percent}%` }} />
      </div>

      <Doughnut counts={counts} />

      <TaskForm onAdd={addTask} />

      <input
        type="search"
        className="search"
        placeholder="Rechercher une tâche ou un réalisateur…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Rechercher une tâche"
      />

      <div className="tabs">
        {FILTERS.map((f) => (
          <button key={f} className="tab" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {shown.length ? (
        <ul>
          {shown.map((t) => (
            <TaskItem key={t.id} task={t} onToggle={toggleTask} onUpdate={updateTask} onStatus={changeStatus} onDelete={deleteTask} />
          ))}
        </ul>
      ) : (
        <div className="empty">
          {tasks.length ? "Aucune tâche ne correspond." : "Rien à faire pour l’instant. Ajoutez une tâche ci-dessus."}
        </div>
      )}

      <div className="foot">
        <span>{tasks.length - doneCount} à faire</span>
        {doneCount > 0 && (
          <button className="link" onClick={clearDone}>
            Supprimer les terminées
          </button>
        )}
      </div>
    </main>
  );
}
