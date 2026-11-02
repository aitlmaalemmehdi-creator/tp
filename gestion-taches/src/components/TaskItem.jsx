import { useState } from "react";
import { getStatus } from "../utils.js";

const fmt = (d) => (d ? new Date(d + "T00:00:00").toLocaleDateString("fr-FR") : "—");
const today = () => new Date().toISOString().slice(0, 10);

export default function TaskItem({ task, onToggle, onUpdate, onStatus, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task);
  const [error, setError] = useState("");

  const startEdit = () => {
    setDraft(task);
    setError("");
    setEditing(true);
  };

  const set = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });

  const save = () => {
    const title = draft.title.trim();
    if (!title) {
      setError("Le titre est obligatoire.");
      return;
    }
    if (draft.startDate && draft.endDate && draft.endDate < draft.startDate) {
      setError("La date de fin doit être après la date de début.");
      return;
    }
    onUpdate(task.id, {
      title,
      director: (draft.director || "").trim(),
      startDate: draft.startDate || "",
      endDate: draft.endDate || "",
    });
    setEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") setEditing(false);
  };

  const late = !task.done && task.endDate && task.endDate < today();

  return (
    <li className={`p-${task.priority}${task.done ? " done" : ""}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={`Terminer : ${task.title}`}
      />

      {editing ? (
        <div className="body editing" onKeyDown={onKeyDown}>
          <input type="text" name="title" autoFocus value={draft.title} onChange={set} placeholder="Titre" />
          <input type="text" name="director" value={draft.director || ""} onChange={set} placeholder="Réalisateur" />
          <label className="field">
            Début
            <input type="date" name="startDate" value={draft.startDate || ""} onChange={set} />
          </label>
          <label className="field">
            Fin
            <input type="date" name="endDate" min={draft.startDate || ""} value={draft.endDate || ""} onChange={set} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <div className="row">
            <button className="primary small" onClick={save}>Enregistrer</button>
            <button className="icon" onClick={() => setEditing(false)}>Annuler</button>
          </div>
        </div>
      ) : (
        <div className="body" onDoubleClick={startEdit} title="Double-clic pour modifier">
          <span className="txt">{task.title}</span>
          <span className="meta">
            Réalisateur : {task.director || "—"} · Du {fmt(task.startDate)} au {fmt(task.endDate)}
            {late && <strong className="late"> · En retard</strong>}
          </span>
        </div>
      )}

      <select
        className="status"
        value={getStatus(task)}
        onChange={(e) => onStatus(task.id, e.target.value)}
        aria-label="Statut"
      >
        <option value="à faire">À faire</option>
        <option value="en cours">En cours</option>
        <option value="terminée">Terminée</option>
      </select>
      <span className="tag">{task.priority}</span>
      {!editing && <button className="icon" onClick={startEdit}>Modifier</button>}
      <button className="icon" onClick={() => onDelete(task.id)}>Supprimer</button>
    </li>
  );
}
