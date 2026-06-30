import React from 'react';
import { Sun, Moon } from 'lucide-react';

function Header({ darkMode, setDarkMode }) {
  return (
    <header className="app-header">
      <div className="app-title-wrapper">
        <h1 className="app-title">TaskFlow</h1>
        <p className="app-subtitle">Organize suas tarefas de forma simples.</p>
      </div>
      <button 
        onClick={() => setDarkMode(!darkMode)} 
        className="theme-toggle-btn"
        aria-label={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
        title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}

export default Header;
