import { useState } from "react";

const EMPTY = { title: "", director: "", startDate: "", endDate: "", priority: "moyenne" };

export default function TaskForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setError("La date de fin doit être après la date de début.");
      return;
    }
    setError("");
    onAdd({ ...form, title, director: form.director.trim() });
    setForm(EMPTY);
  };

  return (
    <form className="add" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Que devez-vous faire ?"
        value={form.title}
        onChange={set}
        aria-label="Nouvelle tâche"
      />
      <input
        type="text"
        name="director"
        placeholder="Réalisateur"
        value={form.director}
        onChange={set}
        aria-label="Réalisateur"
      />
      <label className="field">
        Début
        <input type="date" name="startDate" value={form.startDate} onChange={set} />
      </label>
      <label className="field">
        Fin
        <input type="date" name="endDate" min={form.startDate} value={form.endDate} onChange={set} />
      </label>
      <select name="priority" value={form.priority} onChange={set} aria-label="Priorité">
        <option value="haute">Haute</option>
        <option value="moyenne">Moyenne</option>
        <option value="basse">Basse</option>
      </select>
      <button className="primary" type="submit">
        Ajouter
      </button>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  );
}
