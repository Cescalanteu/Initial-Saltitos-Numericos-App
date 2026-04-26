import type { AttemptLog } from "../types";
import { downloadTextFile, toProgressCsv } from "../storage/progress";

interface ProgressDashboardProps {
  logs: AttemptLog[];
}

export function ProgressDashboard({ logs }: ProgressDashboardProps) {
  const completed = logs.filter((log) => log.completed).length;
  const lastFive = logs.slice(0, 5);

  const exportJson = () => {
    downloadTextFile("saltitos-progreso.json", JSON.stringify(logs, null, 2), "application/json");
  };

  const exportCsv = () => {
    downloadTextFile("saltitos-progreso.csv", toProgressCsv(logs), "text/csv;charset=utf-8");
  };

  return (
    <section className="progress-dashboard" aria-label="Métricas locales">
      <h2>Progreso local</h2>
      <div className="metric-row">
        <div>
          <strong>{logs.length}</strong>
          <span>registros</span>
        </div>
        <div>
          <strong>{completed}</strong>
          <span>completados</span>
        </div>
      </div>
      <div className="dashboard-actions">
        <button type="button" onClick={exportJson} aria-label="Exportar progreso en JSON" disabled={logs.length === 0}>
          Exportar JSON
        </button>
        <button type="button" onClick={exportCsv} aria-label="Exportar progreso en CSV" disabled={logs.length === 0}>
          Exportar CSV
        </button>
      </div>
      {lastFive.length === 0 ? (
        <p className="empty-log">Todavía no hay registros.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Problema</th>
              <th>Listo</th>
              <th>Intentos</th>
              <th>Ayudas</th>
              <th>Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {lastFive.map((log) => (
              <tr key={log.id}>
                <td>{log.problem}</td>
                <td>{log.completed ? "Sí" : "No"}</td>
                <td>{log.selectedStartAttempts + log.jumpAttempts}</td>
                <td>{log.hintsUsed}</td>
                <td>{log.durationMs ? `${Math.round(log.durationMs / 1000)}s` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
