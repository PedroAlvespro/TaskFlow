import React from 'react';

function Filter({ activeFilter, onFilterChange, sortBy, onSortChange }) {
  return (
    <div className="task-controls" style={{ flex: 1, width: '100%' }}>
      {/* Botões de Filtro */}
      <div className="filter-container" style={{ flexWrap: 'wrap' }}>
        <button
          onClick={() => onFilterChange('all')}
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
        >
          <span>Todas</span>
        </button>
        <button
          onClick={() => onFilterChange('pending')}
          className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
        >
          <span>Pendentes</span>
        </button>
        <button
          onClick={() => onFilterChange('in_progress')}
          className={`filter-btn ${activeFilter === 'in_progress' ? 'active' : ''}`}
        >
          <span>Em andamento</span>
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
        >
          <span>Concluídas</span>
        </button>
        <button
          onClick={() => onFilterChange('blocked')}
          className={`filter-btn ${activeFilter === 'blocked' ? 'active' : ''}`}
          style={{ borderColor: activeFilter === 'blocked' ? 'var(--danger)' : '' }}
        >
          <span>Bloqueadas</span>
        </button>
      </div>

      {/* Seletor de Ordenação */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Ordenar:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="recent">Mais recente</option>
          <option value="oldest">Mais antiga</option>
          <option value="alphabetical">Ordem alfabética</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;
