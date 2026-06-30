import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const COLOR_PRESETS = [
  { value: '#3B82F6', name: 'Azul' },
  { value: '#10B981', name: 'Verde' },
  { value: '#EF4444', name: 'Vermelho' },
  { value: '#F59E0B', name: 'Amarelo' },
  { value: '#F97316', name: 'Laranja' },
  { value: '#14B8A6', name: 'Teal' },
  { value: '#6366F1', name: 'Indigo' },
  { value: '#8B5CF6', name: 'Roxo' }
];

const ICON_PRESETS = [
  'Folder',
  'Home',
  'BookOpen',
  'Briefcase',
  'ShoppingCart',
  'User',
  'Heart',
  'Sparkles'
];

function FolderModal({ isOpen, onClose, onCreateFolder }) {
  const [nome, setNome] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].value);
  const [selectedIcon, setSelectedIcon] = useState(ICON_PRESETS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;
    
    onCreateFolder(nome.trim(), selectedColor, selectedIcon);
    
    // Limpar estados
    setNome('');
    setSelectedColor(COLOR_PRESETS[0].value);
    setSelectedIcon(ICON_PRESETS[0]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Nova Pasta</h3>
          <button onClick={onClose} className="modal-close-btn" title="Fechar">
            <Icons.X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexSelf: 'stretch', flexDirection: 'column', gap: '16px' }}>
          {/* Nome da Pasta */}
          <div className="form-group">
            <label className="form-label" htmlFor="folder-name-input">Nome da Pasta</label>
            <input
              type="text"
              id="folder-name-input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Trabalho, Casa, Estudos..."
              className="form-input"
              required
              maxLength={30}
              autoFocus
            />
          </div>

          {/* Escolha da Cor */}
          <div className="form-group">
            <label className="form-label">Escolha a Cor</label>
            <div className="color-options">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`color-option-btn ${selectedColor === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  aria-label={`Cor ${color.name}`}
                />
              ))}
            </div>
          </div>

          {/* Escolha do Ícone */}
          <div className="form-group">
            <label className="form-label">Escolha o Ícone</label>
            <div className="icon-options">
              {ICON_PRESETS.map((iconName) => {
                const IconComponent = Icons[iconName] || Icons.Folder;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`icon-option-btn ${selectedIcon === iconName ? 'selected' : ''}`}
                    title={iconName}
                    aria-label={`Ícone ${iconName}`}
                  >
                    <IconComponent size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ações */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Criar Pasta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FolderModal;
