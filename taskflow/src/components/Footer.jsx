import React from 'react';

function Footer({ totalTasks, pendingTasks, completedTasks }) {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <footer className="app-footer">
      {/* Grade de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{totalTasks}</span>
          <span className="stat-label">Total de tarefas</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{pendingTasks}</span>
          <span className="stat-label">Pendentes</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{completedTasks}</span>
          <span className="stat-label">Concluídas</span>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="progress-wrapper">
        <div className="progress-info">
          <span className="progress-label">Progresso das tarefas</span>
          <span className="progress-percentage">{percentage}% concluído</span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${percentage}%` }}
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      <div className="footer-credits">
        Desenvolvido por PedroAlvesPro
      </div>
    </footer>
  );
}

export default Footer;
