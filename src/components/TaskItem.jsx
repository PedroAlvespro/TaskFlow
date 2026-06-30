import React, { useState } from 'react';
import { Check, Calendar, Lock, Unlock, Pencil, Trash2, Save, X } from 'lucide-react';

function TaskItem({ task, onToggleComplete, onDeleteTask, onEditTask, onBlockTask, onUnblockTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedPriority, setEditedPriority] = useState(task.priority || 'baixa');
  const [editedNote, setEditedNote] = useState(task.observacao || '');

  const handleSave = () => {
    if (!editedTitle.trim()) return;
    onEditTask(task.id, editedTitle.trim(), editedPriority, editedNote.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedPriority(task.priority || 'baixa');
    setEditedNote(task.observacao || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Retorna a tradução da prioridade e a classe CSS correspondente
  const getPriorityInfo = (pri) => {
    switch (pri) {
      case 'alta':
        return { label: 'Alta', className: 'high' };
      case 'media':
        return { label: 'Média', className: 'medium' };
      case 'baixa':
      default:
        return { label: 'Baixa', className: 'low' };
    }
  };

  const priorityInfo = getPriorityInfo(task.priority);

  const getStatusBadge = () => {
    switch (task.status) {
      case 'andamento':
        return { label: 'Em andamento', className: 'andamento' };
      case 'concluida':
        return { label: 'Concluída', className: 'concluida' };
      case 'bloqueada':
        return { label: 'Bloqueada', className: 'bloqueada' };
      default:
        return { label: 'Pendente', className: 'pendente' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className={`task-item ${task.status === 'bloqueada' ? 'blocked' : task.concluida ? 'completed' : ''}`}>
      <div className="task-item-content">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`checkbox-btn ${task.concluida ? 'checked' : ''}`}
          aria-label={task.concluida ? "Desmarcar tarefa como concluída" : "Marcar tarefa como concluída"}
          title={task.concluida ? "Desmarcar" : "Concluir"}
        >
          <Check size={14} strokeWidth={3} />
        </button>

        <div className="task-info-wrapper">
          {isEditing ? (
            <div className="edit-task-form">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="task-edit-input"
                placeholder="Título da tarefa"
                autoFocus
              />
              
              <div className="edit-task-inputs-row">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600' }}>Prioridade</span>
                  <div className="priority-selector">
                    <button
                      type="button"
                      onClick={() => setEditedPriority('baixa')}
                      className={`priority-btn low ${editedPriority === 'baixa' ? 'selected' : ''}`}
                      style={{ padding: '4px' }}
                    >
                      Baixa
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditedPriority('media')}
                      className={`priority-btn medium ${editedPriority === 'media' ? 'selected' : ''}`}
                      style={{ padding: '4px' }}
                    >
                      Média
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditedPriority('alta')}
                      className={`priority-btn high ${editedPriority === 'alta' ? 'selected' : ''}`}
                      style={{ padding: '4px' }}
                    >
                      Alta
                    </button>
                  </div>
                </div>

                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600' }}>Observação</span>
                  <input
                    type="text"
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                    placeholder="Nota da tarefa..."
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="task-item-header">
                <div className="task-item-title-group">
                  <span className="task-text">{task.title}</span>
                  <span className={`priority-badge ${priorityInfo.className}`}>{priorityInfo.label}</span>
                </div>
                <span className={`status-badge ${statusBadge.className}`}>{statusBadge.label}</span>
              </div>

              {task.observacao && (
                <div className="task-notes">
                  {task.observacao}
                </div>
              )}

              {task.status === 'bloqueada' && (
                <div className="task-blocker-details">
                  <div className="blocker-header">
                    <Lock size={14} /> Bloqueio ativo
                  </div>
                  <div className="blocker-reason">Motivo: {task.motivo}</div>
                  <div className="blocker-meta-row">
                    <span>Tipo: {task.tipo}</span>
                    <span>Prioridade: {task.prioridade}</span>
                    {task.responsavel && <span>Responsável: {task.responsavel}</span>}
                    {task.dataBloqueio && <span>Bloqueado em: {task.dataBloqueio}</span>}
                  </div>
                </div>
              )}

              <div className="task-item-meta">
                <Calendar size={12} />
                <span>Criada em: {task.createdAt}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="task-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="action-btn save"
              title="Confirmar alterações"
            >
              <Save size={14} />
              <span>Confirmar</span>
            </button>
            <button
              onClick={handleCancel}
              className="action-btn cancel"
              title="Cancelar edição"
            >
              <X size={14} />
              <span>Cancelar</span>
            </button>
          </>
        ) : (
          <>
            <div className="task-actions-group">
              {!task.concluida && task.status !== 'bloqueada' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="action-btn edit"
                  title="Editar tarefa"
                >
                  <Pencil size={14} />
                  <span>Editar</span>
                </button>
              )}
              {task.status !== 'bloqueada' ? (
                <button
                  onClick={() => onBlockTask(task.id)}
                  className="action-btn block"
                  title="Bloquear tarefa"
                >
                  <Lock size={14} />
                  <span>Bloquear</span>
                </button>
              ) : (
                <button
                  onClick={() => onUnblockTask(task.id)}
                  className="action-btn unblock"
                  title="Desbloquear tarefa"
                >
                  <Unlock size={14} />
                  <span>Desbloquear</span>
                </button>
              )}
            </div>

            <button
              onClick={() => onDeleteTask(task.id)}
              className="action-btn delete"
              title="Excluir tarefa"
            >
              <Trash2 size={14} />
              <span>Excluir</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
