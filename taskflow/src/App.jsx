import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import FolderCard from './components/FolderCard';
import FolderModal from './components/FolderModal';
import TaskForm from './components/TaskForm';
import SearchBar from './components/SearchBar';
import Filter from './components/Filter';
import TaskList from './components/TaskList';
import BlockModal from './components/BlockModal';
import * as Icons from 'lucide-react';
import './styles/app.css';

function App() {
  const formatNow = () => new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formatTime = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const normalizeTask = (task) => ({
    ...task,
    status: task.status || (task.concluida ? 'concluida' : 'pendente'),
    bloqueio: task.bloqueio ?? false,
    motivo: task.motivo || '',
    tipo: task.tipo || 'Dependência',
    prioridade: task.prioridade || task.priority || 'baixa',
    responsavel: task.responsavel || '',
    dataBloqueio: task.dataBloqueio || '',
    dataDesbloqueio: task.dataDesbloqueio || '',
    history: task.history || [
      {
        time: task.createdAtTimestamp
          ? new Date(task.createdAtTimestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          : formatTime(),
        event: 'Tarefa criada.'
      }
    ]
  });

  const normalizeFolders = (folders) =>
    folders.map((folder) => ({
      ...folder,
      tarefas: folder.tarefas ? folder.tarefas.map(normalizeTask) : []
    }));

  // Estado principal: Array de Pastas (Workspaces)
  const [folders, setFolders] = useState(() => {
    const savedFolders = localStorage.getItem('taskflow_folders');
    if (savedFolders) {
      try {
        return normalizeFolders(JSON.parse(savedFolders));
      } catch (error) {
        console.error('Falha ao carregar tarefas salvas:', error);
      }
    }
    
    // Pastas mockadas iniciais para uma primeira impressão incrível
    const nowStr = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const nowTimestamp = Date.now();
    return [
      {
        id: 'folder-1',
        nome: 'Casa 🏠',
        cor: '#6366F1', // Indigo
        icone: 'Home',
        dataCriacao: new Date().toLocaleDateString('pt-BR'),
        createdAtTimestamp: nowTimestamp,
        tarefas: [
          { 
            id: 'task-1-1', 
            title: 'Lavar louça 🍽️', 
            concluida: true, 
            createdAt: nowStr,
            createdAtTimestamp: nowTimestamp - 60000, 
            priority: 'baixa',
            observacao: 'Usar detergente de coco'
          },
          { 
            id: 'task-1-2', 
            title: 'Passear com o cachorro 🐕', 
            concluida: false, 
            createdAt: nowStr,
            createdAtTimestamp: nowTimestamp, 
            priority: 'alta',
            observacao: 'Levar saquinho para as necessidades'
          }
        ]
      },
      {
        id: 'folder-2',
        nome: 'Estudos 📚',
        cor: '#14B8A6', // Teal
        icone: 'BookOpen',
        dataCriacao: new Date().toLocaleDateString('pt-BR'),
        createdAtTimestamp: nowTimestamp + 1000,
        tarefas: [
          { 
            id: 'task-2-1', 
            title: 'Finalizar trabalho de React ⚛️', 
            concluida: false, 
            createdAt: nowStr,
            createdAtTimestamp: nowTimestamp + 2000, 
            priority: 'alta',
            observacao: 'Organizar em componentes modulares'
          },
          { 
            id: 'task-2-2', 
            title: 'Estudar Banco de Dados 🗄️', 
            concluida: false, 
            createdAt: nowStr,
            createdAtTimestamp: nowTimestamp + 3000, 
            priority: 'media',
            observacao: ''
          }
        ]
      }
    ];
  });

  // Estado de navegação: ID da pasta aberta (null se estiver na Tela Inicial)
  const [currentFolderId, setCurrentFolderId] = useState(null);

  // Controle de abertura do Modal de Criação de Pasta
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedTaskForBlock, setSelectedTaskForBlock] = useState(null);

  // Estados de busca, filtros e ordenação de tarefas
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Estado do Tema Escuro
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('taskflow_theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Efeito para persistir pastas no localStorage
  useEffect(() => {
    localStorage.setItem('taskflow_folders', JSON.stringify(folders));
  }, [folders]);

  // Efeito para gerenciar e salvar tema
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('taskflow_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('taskflow_theme', 'light');
    }
  }, [darkMode]);

  // AÇÕES DE PASTAS

  // Criar uma nova pasta
  const handleCreateFolder = (nome, cor, icone) => {
    const newFolder = {
      id: 'folder-' + Date.now().toString(),
      nome,
      cor,
      icone,
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
      createdAtTimestamp: Date.now(),
      tarefas: []
    };
    setFolders((prevFolders) => [newFolder, ...prevFolders]);
    setIsFolderModalOpen(false);
  };

  // Excluir pasta
  const handleDeleteFolder = (folderId) => {
    setFolders((prevFolders) => prevFolders.filter((f) => f.id !== folderId));
    if (currentFolderId === folderId) {
      setCurrentFolderId(null);
    }
  };

  // AÇÕES DE TAREFAS (Aplicadas à pasta ativa)

  // Adicionar tarefa na pasta ativa
  const handleAddTask = (title, priority, note) => {
    if (!currentFolderId) return;
    const nowStr = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const nowTimestamp = Date.now();

    const newTask = {
      id: 'task-' + nowTimestamp.toString(),
      title,
      concluida: false,
      status: 'pendente',
      createdAt: nowStr,
      createdAtTimestamp: nowTimestamp,
      priority,
      observacao: note,
      bloqueio: false,
      motivo: '',
      tipo: 'Dependência',
      prioridade: 'baixa',
      responsavel: '',
      dataBloqueio: '',
      dataDesbloqueio: '',
      history: [
        {
          time: formatTime(),
          event: 'Tarefa criada.'
        }
      ]
    };

    setFolders((prevFolders) =>
      prevFolders.map((folder) => {
        if (folder.id === currentFolderId) {
          return {
            ...folder,
            tarefas: [newTask, ...folder.tarefas]
          };
        }
        return folder;
      })
    );
  };

  const handleToggleComplete = (taskId) => {
    if (!currentFolderId) return;
    setFolders((prevFolders) =>
      prevFolders.map((folder) => {
        if (folder.id === currentFolderId) {
          return {
            ...folder,
            tarefas: folder.tarefas.map((task) => {
              if (task.id !== taskId || task.status === 'bloqueada') return task;

              const nextStatus = task.status === 'concluida' ? 'pendente' : 'concluida';
              return {
                ...task,
                concluida: nextStatus === 'concluida',
                status: nextStatus,
                history: [
                  ...task.history,
                  {
                    time: formatTime(),
                    event: nextStatus === 'concluida' ? 'Tarefa concluída.' : 'Tarefa retornou para pendente.'
                  }
                ]
              };
            })
          };
        }
        return folder;
      })
    );
  };

  const handleOpenBlockModal = (taskId) => {
    setSelectedTaskForBlock(taskId);
    setIsBlockModalOpen(true);
  };

  const handleBlockConfirm = (motivo, tipo, prioridade, responsavel) => {
    if (!currentFolderId || !selectedTaskForBlock) return;
    setFolders((prevFolders) =>
      prevFolders.map((folder) => {
        if (folder.id !== currentFolderId) return folder;
        return {
          ...folder,
          tarefas: folder.tarefas.map((task) => {
            if (task.id !== selectedTaskForBlock) return task;
            return {
              ...task,
              concluida: false,
              status: 'bloqueada',
              bloqueio: true,
              motivo,
              tipo,
              prioridade,
              responsavel,
              dataBloqueio: formatNow(),
              dataDesbloqueio: '',
              history: [
                ...task.history,
                {
                  time: formatTime(),
                  event: 'Tarefa bloqueada.'
                },
                {
                  time: formatTime(),
                  event: `Motivo: ${motivo}`
                }
              ]
            };
          })
        };
      })
    );
    setIsBlockModalOpen(false);
    setSelectedTaskForBlock(null);
  };

  const handleUnblockTask = (taskId) => {
    if (!currentFolderId) return;
    setFolders((prevFolders) =>
      prevFolders.map((folder) => {
        if (folder.id !== currentFolderId) return folder;
        return {
          ...folder,
          tarefas: folder.tarefas.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              status: 'pendente',
              concluida: false,
              bloqueio: false,
              dataDesbloqueio: formatNow(),
              history: [
                ...task.history,
                {
                  time: formatTime(),
                  event: 'Bloqueio removido.'
                }
              ]
            };
          })
        };
      })
    );
  };

  // Excluir tarefa na pasta ativa
  const handleDeleteTask = (taskId) => {
    if (!currentFolderId) return;
    setFolders((prevFolders) =>
      prevFolders.map((folder) => {
        if (folder.id === currentFolderId) {
          return {
            ...folder,
            tarefas: folder.tarefas.filter((task) => task.id !== taskId)
          };
        }
        return folder;
      })
    );
  };

  // Editar tarefa na pasta ativa
  const handleEditTask = (taskId, newTitle, newPriority, newNote) => {
    if (!currentFolderId) return;
    setFolders((prevFolders) =>
      prevFolders.map((folder) => {
        if (folder.id === currentFolderId) {
          return {
            ...folder,
            tarefas: folder.tarefas.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    title: newTitle,
                    priority: newPriority,
                    observacao: newNote,
                    history: [
                      ...task.history,
                      {
                        time: formatTime(),
                        event: 'Tarefa editada.'
                      }
                    ]
                  }
                : task
            )
          };
        }
        return folder;
      })
    );
  };

  // CÁLCULO DE ESTATÍSTICAS DO DASHBOARD

  const totalFolders = folders.length;
  
  // Total de tarefas acumulado de todas as pastas
  const totalTasks = folders.reduce((acc, folder) => acc + (folder.tarefas ? folder.tarefas.length : 0), 0);
  
  // Total por status acumulado
  const completedTasks = folders.reduce(
    (acc, folder) => acc + (folder.tarefas ? folder.tarefas.filter((t) => t.status === 'concluida').length : 0),
    0
  );
  const inProgressTasks = folders.reduce(
    (acc, folder) => acc + (folder.tarefas ? folder.tarefas.filter((t) => t.status === 'andamento').length : 0),
    0
  );
  const pendingTasks = folders.reduce(
    (acc, folder) => acc + (folder.tarefas ? folder.tarefas.filter((t) => t.status === 'pendente').length : 0),
    0
  );
  const blockedTasks = folders.reduce(
    (acc, folder) => acc + (folder.tarefas ? folder.tarefas.filter((t) => t.status === 'bloqueada').length : 0),
    0
  );

  // Lógica para obter a pasta selecionada
  const activeFolder = folders.find((f) => f.id === currentFolderId);

  // Filtragem e ordenação de tarefas dentro da pasta aberta
  let displayTasks = [];
  if (activeFolder && activeFolder.tarefas) {
      displayTasks = activeFolder.tarefas.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        if (activeFilter === 'pending') {
          return matchesSearch && task.status === 'pendente';
        }
        if (activeFilter === 'in_progress') {
          return matchesSearch && task.status === 'andamento';
        }
        if (activeFilter === 'completed') {
          return matchesSearch && task.status === 'concluida';
        }
        if (activeFilter === 'blocked') {
          return matchesSearch && task.status === 'bloqueada';
        }
        return matchesSearch;
      });

      displayTasks.sort((a, b) => {
        if (sortBy === 'oldest') {
          return a.createdAtTimestamp - b.createdAtTimestamp;
        }
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }
        return b.createdAtTimestamp - a.createdAtTimestamp;
      });
  }

  // Resolver ícone da pasta atual
  const ActiveFolderIcon = activeFolder ? (Icons[activeFolder.icone] || Icons.Folder) : Icons.Folder;

  return (
    <div className="app-container">
      {/* HEADER DO APLICATIVO */}
      <header className="app-header">
        <div className="header-nav-wrapper">
          {currentFolderId && (
            <button onClick={() => { setCurrentFolderId(null); setSearchTerm(''); }} className="back-btn" title="Voltar para a tela inicial">
              <Icons.ChevronLeft size={16} />
              <span>Voltar</span>
            </button>
          )}
          <div className="app-title-wrapper">
            <h1 className="app-title">TaskFlow</h1>
            <p className="app-subtitle">
              {currentFolderId && activeFolder
                ? `Organizador de tarefas • Pasta ${activeFolder.nome}`
                : "Organize suas tarefas de forma simples."}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="theme-toggle-btn"
          aria-label={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
          title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
        >
          {darkMode ? <Icons.Sun size={18} /> : <Icons.Moon size={18} />}
        </button>
      </header>

      {/* TELA INICIAL: GRADE DE PASTAS E DASHBOARD */}
      {!currentFolderId ? (
        <>
          <Dashboard 
            totalFolders={totalFolders} 
            totalTasks={totalTasks} 
            completedTasks={completedTasks} 
            pendingTasks={pendingTasks} 
            inProgressTasks={inProgressTasks}
            blockedTasks={blockedTasks} 
          />

          <div className="section-header">
            <h3 className="section-title">Minhas Pastas</h3>
            <button onClick={() => setIsFolderModalOpen(true)} className="add-folder-btn">
              <Icons.FolderPlus size={16} />
              <span>Nova Pasta</span>
            </button>
          </div>

          {folders.length === 0 ? (
            <div className="empty-state">
              <Icons.FolderSearch size={48} className="empty-state-icon" />
              <h3>Nenhuma pasta encontrada</h3>
              <p>Comece criando uma pasta para organizar suas tarefas!</p>
            </div>
          ) : (
            <div className="folders-grid">
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={() => {
                    setCurrentFolderId(folder.id);
                    setSearchTerm('');
                    setActiveFilter('all');
                    setSortBy('recent');
                  }}
                  onDelete={handleDeleteFolder}
                />
              ))}
            </div>
          )}

          {/* Modal de Criação de Pasta */}
          <FolderModal
            isOpen={isFolderModalOpen}
            onClose={() => setIsFolderModalOpen(false)}
            onCreateFolder={handleCreateFolder}
          />
        </>
      ) : (
        /* TELA DE UMA PASTA ESPECÍFICA */
        <>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              backgroundColor: 'var(--bg-app)', 
              borderRadius: '12px', 
              borderLeft: `5px solid ${activeFolder.cor}` 
            }}
          >
            <div style={{ color: activeFolder.cor, display: 'flex', alignItems: 'center' }}>
              <ActiveFolderIcon size={24} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', fontWeight: '600' }}>
              {activeFolder.nome}
            </h2>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: 'auto', fontWeight: '500' }}>
              {activeFolder.tarefas ? activeFolder.tarefas.length : 0} tarefas cadastradas
            </span>
          </div>

          {/* Formulário de Adicionar Tarefa */}
          <TaskForm onAddTask={handleAddTask} />

          {/* Filtros, Busca e Ordenação */}
          <div className="controls-container">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <Filter 
              activeFilter={activeFilter} 
              onFilterChange={setActiveFilter} 
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Lista de Tarefas da Pasta */}
          <TaskList
            tasks={displayTasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onBlockTask={handleOpenBlockModal}
            onUnblockTask={handleUnblockTask}
          />
          <BlockModal
            isOpen={isBlockModalOpen}
            onClose={() => {
              setIsBlockModalOpen(false);
              setSelectedTaskForBlock(null);
            }}
            onBlockConfirm={handleBlockConfirm}
            taskTitle={activeFolder?.tarefas.find((task) => task.id === selectedTaskForBlock)?.title || ''}
          />
        </>
      )}

      {/* RODAPÉ GERAL */}
      <footer className="app-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
        <div className="footer-credits">
          Desenvolvido por PedroAlvesPro
        </div>
      </footer>
    </div>
  );
}

export default App;
