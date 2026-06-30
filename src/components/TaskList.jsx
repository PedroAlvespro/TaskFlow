import React from 'react';
import TaskItem from './TaskItem';
import { ClipboardList } from 'lucide-react';

function TaskList({ tasks, onToggleComplete, onDeleteTask, onEditTask, onBlockTask, onUnblockTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={48} className="empty-state-icon" />
        <h3>Nenhuma tarefa encontrada</h3>
        <p>Experimente adicionar uma nova tarefa para começar a se organizar!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onBlockTask={onBlockTask}
          onUnblockTask={onUnblockTask}
        />
      ))}
    </div>
  );
}

export default TaskList;
