import React, { useState } from 'react';
import { Plus, ListTodo } from 'lucide-react';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('baixa'); // padrão baixa
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title.trim(), priority, note.trim());
    
    // reset form
    setTitle('');
    setPriority('baixa');
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form-expanded">
      {/* Linha 1: Input do Título */}
      <div className="task-input-wrapper">
        <ListTodo size={20} className="task-input-icon" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite uma nova tarefa..."
          className="task-input"
          maxLength={100}
          required
        />
      </div>

      {/* Linha 2: Campos de Prioridade e Notas */}
      <div className="task-form-row">
        {/* Prioridade */}
        <div className="task-form-field">
          <label className="form-label" style={{ fontSize: '12px' }}>Prioridade</label>
          <div className="priority-selector">
            <button
              type="button"
              onClick={() => setPriority('baixa')}
              className={`priority-btn low ${priority === 'baixa' ? 'selected' : ''}`}
            >
              Baixa
            </button>
            <button
              type="button"
              onClick={() => setPriority('media')}
              className={`priority-btn medium ${priority === 'media' ? 'selected' : ''}`}
            >
              Média
            </button>
            <button
              type="button"
              onClick={() => setPriority('alta')}
              className={`priority-btn high ${priority === 'alta' ? 'selected' : ''}`}
            >
              Alta
            </button>
          </div>
        </div>

        {/* Observações / Notas */}
        <div className="task-form-field" style={{ flex: 2 }}>
          <label className="form-label" style={{ fontSize: '12px' }} htmlFor="task-note-input">Observação (opcional)</label>
          <input
            type="text"
            id="task-note-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex: Entregar antes das 18h..."
            className="form-input compact-input"
            maxLength={150}
          />
        </div>

        {/* Botão Submeter */}
        <div className="task-submit-wrapper">
          <button type="submit" className="task-submit-btn">
            <Plus size={18} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default TaskForm;
