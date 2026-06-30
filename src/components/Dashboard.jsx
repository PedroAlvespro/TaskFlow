import React from 'react';
import { AlertTriangle } from 'lucide-react';

function Dashboard({ totalFolders, totalTasks, pendingTasks, inProgressTasks, completedTasks, blockedTasks }) {
  const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="dashboard-container">
      <h3 className="dashboard-title">Dashboard Geral</h3>
      
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-value">{totalFolders}</span>
          <span className="dashboard-stat-label">Pastas</span>
        </div>
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-value">{totalTasks}</span>
          <span className="dashboard-stat-label">Total de Tarefas</span>
        </div>
        <div className="dashboard-stat-card" style={{ borderLeft: '3px solid #64748B' }}>
          <span className="dashboard-stat-value">{pendingTasks}</span>
          <span className="dashboard-stat-label">Pendentes</span>
        </div>
        <div className="dashboard-stat-card" style={{ borderLeft: '3px solid #2563EB' }}>
          <span className="dashboard-stat-value">{inProgressTasks}</span>
          <span className="dashboard-stat-label">Em Andamento</span>
        </div>
        <div className="dashboard-stat-card" style={{ borderLeft: '3px solid #22C55E' }}>
          <span className="dashboard-stat-value">{completedTasks}</span>
          <span className="dashboard-stat-label">Concluídas</span>
        </div>
        <div className="dashboard-stat-card" style={{ borderLeft: '3px solid #EF4444' }}>
          <span className="dashboard-stat-value" style={{ color: 'var(--danger)' }}>{blockedTasks}</span>
          <span className="dashboard-stat-label">Bloqueadas</span>
        </div>
      </div>

      {/* Alerta de tarefas bloqueadas */}
      {blockedTasks > 0 && (
        <div className="blocked-alert-banner">
          <AlertTriangle size={18} />
          <span>Atenção: Existem {blockedTasks} tarefa{blockedTasks !== 1 ? 's' : ''} bloqueada{blockedTasks !== 1 ? 's' : ''} que precisa{blockedTasks !== 1 ? 'm' : 's'} de atenção.</span>
        </div>
      )}

      {/* Barra de Progresso Geral */}
      <div className="progress-wrapper" style={{ marginTop: '8px' }}>
        <div className="progress-info">
          <span className="progress-label">Taxa Geral de Conclusão</span>
          <span className="progress-percentage">{overallPercentage}% concluído</span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${overallPercentage}%` }}
            aria-valuenow={overallPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
