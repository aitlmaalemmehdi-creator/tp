const SEGMENTS = [
  { key: "à faire", label: "À faire", color: "var(--todo)" },
  { key: "en cours", label: "En cours", color: "var(--mid)" },
  { key: "terminée", label: "Terminées", color: "var(--accent)" },
];

export default function Doughnut({ counts }) {
  const total = SEGMENTS.reduce((n, s) => n + counts[s.key], 0);
  const percentDone = total ? Math.round((counts["terminée"] / total) * 100) : 0;

  let offset = 25; // départ en haut du cercle
  return (
    <section className="chart" aria-label="Avancement des tâches">
      <svg viewBox="0 0 42 42" role="img" aria-label={`${percentDone}% des tâches terminées`}>
        <circle cx="21" cy="21" r="15.91549" fill="none" stroke="var(--line)" strokeWidth="6" />
        {total > 0 &&
          SEGMENTS.map((s) => {
            const pct = (counts[s.key] / total) * 100;
            if (!pct) return null;
            const circle = (
              <circle
                key={s.key}
                cx="21"
                cy="21"
                r="15.91549"
                fill="none"
                stroke={s.color}
                strokeWidth="6"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={offset}
              />
            );
            offset -= pct;
            return circle;
          })}
        <text x="21" y="22.5" textAnchor="middle" className="chart-num">{percentDone}%</text>
      </svg>
      <ul className="legend">
        {SEGMENTS.map((s) => (
          <li key={s.key}>
            <i style={{ background: s.color }} />
            {s.label} <strong>{counts[s.key]}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
