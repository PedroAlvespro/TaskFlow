import React from 'react';
import * as Icons from 'lucide-react';

function FolderCard({ folder, onClick, onDelete }) {
  // Obter componente do ícone dinamicamente ou usar Folder como padrão
  const IconComponent = Icons[folder.icone] || Icons.Folder;
  
  const totalTasks = folder.tarefas ? folder.tarefas.length : 0;
  const completedTasks = folder.tarefas ? folder.tarefas.filter(t => t.concluida).length : 0;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleDelete = (e) => {
    e.stopPropagation(); // Evita abrir a pasta ao clicar em excluir
    if (window.confirm(`Tem certeza de que deseja excluir a pasta "${folder.nome}" e todas as suas tarefas?`)) {
      onDelete(folder.id);
    }
  };

  // Cores HSL ou Hex suaves para fundo do ícone
  const lightColor = folder.cor ? `${folder.cor}15` : 'rgba(37, 99, 235, 0.08)';

  return (
    <div 
      className="folder-card" 
      onClick={onClick}
      style={{ 
        '--folder-color': folder.cor,
        '--folder-color-light': lightColor
      }}
    >
      <div className="folder-card-header">
        <div className="folder-card-info">
          <div className="folder-icon-wrapper">
            <IconComponent size={24} />
          </div>
          <span className="folder-name">{folder.nome}</span>
        </div>
        <button 
          onClick={handleDelete}
          className="folder-delete-btn"
          title="Excluir Pasta"
        >
          <Icons.Trash2 size={16} />
        </button>
      </div>

      <div className="folder-card-stats">
        <span>{totalTasks} tarefa{totalTasks !== 1 ? 's' : ''}</span>
        <span>{completedTasks} concluída{completedTasks !== 1 ? 's' : ''}</span>
      </div>

      <div className="folder-card-progress">
        <div className="folder-progress-bar-bg">
          <div 
            className="folder-progress-bar-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="folder-progress-summary">
          {percentage}%
        </span>
      </div>

      <div className="folder-card-footer">
        Criada em {folder.dataCriacao}
      </div>
    </div>
  );
}

export default FolderCard;
