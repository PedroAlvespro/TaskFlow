import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

const TIPO_BLOQUEIOS = [
  'Dependência',
  'Material',
  'Cliente',
  'Financeiro',
  'Aprovação',
  'Sistema',
  'Outro'
];

function BlockModal({ isOpen, onClose, onBlockConfirm, taskTitle }) {
  const [motivo, setMotivo] = useState('');
  const [tipo, setTipo] = useState(TIPO_BLOQUEIOS[0]);
  const [prioridade, setPrioridade] = useState('media'); // padrão media
  const [responsavel, setResponsavel] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!motivo.trim()) return;

    onBlockConfirm(motivo.trim(), tipo, prioridade, responsavel.trim());

    // Resetar campos
    setMotivo('');
    setTipo(TIPO_BLOQUEIOS[0]);
    setPrioridade('media');
    setResponsavel('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
            <Lock size={20} />
            <h3 className="modal-title" style={{ fontSize: '18px' }}>Bloquear Tarefa</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Fechar">
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Bloqueando a tarefa: <strong style={{ color: 'var(--text-primary)' }}>{taskTitle}</strong>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Motivo do Bloqueio (Obrigatório) */}
          <div className="form-group">
            <label className="form-label" htmlFor="block-reason-input">Motivo do Bloqueio *</label>
            <input
              type="text"
              id="block-reason-input"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: Aguardando aprovação do professor."
              className="form-input"
              required
              maxLength={100}
              autoFocus
            />
          </div>

          {/* Tipo do Bloqueio */}
          <div className="form-group">
            <label className="form-label" htmlFor="block-type-select">Tipo de Impedimento</label>
            <select
              id="block-type-select"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="form-input"
              style={{ cursor: 'pointer' }}
            >
              {TIPO_BLOQUEIOS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          {/* Prioridade do Bloqueio */}
          <div className="form-group">
            <label className="form-label">Prioridade do Bloqueio</label>
            <div className="priority-selector">
              <button
                type="button"
                onClick={() => setPrioridade('baixa')}
                className={`priority-btn low ${prioridade === 'baixa' ? 'selected' : ''}`}
              >
                Baixa
              </button>
              <button
                type="button"
                onClick={() => setPrioridade('media')}
                className={`priority-btn medium ${prioridade === 'media' ? 'selected' : ''}`}
              >
                Média
              </button>
              <button
                type="button"
                onClick={() => setPrioridade('alta')}
                className={`priority-btn high ${prioridade === 'alta' ? 'selected' : ''}`}
              >
                Alta
              </button>
            </div>
          </div>

          {/* Responsável (Opcional) */}
          <div className="form-group">
            <label className="form-label" htmlFor="block-assignee-input">Responsável (opcional)</label>
            <input
              type="text"
              id="block-assignee-input"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              placeholder="Ex: Professor, Equipe Financeira"
              className="form-input"
              maxLength={40}
            />
          </div>

          {/* Ações */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn btn-warning">
              Bloquear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BlockModal;
