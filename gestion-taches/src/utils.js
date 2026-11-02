export const STATUSES = ["à faire", "en cours", "terminée"];

// Les anciennes tâches (sans statut) sont déduites du champ "done"
export const getStatus = (t) => t.status ?? (t.done ? "terminée" : "à faire");
