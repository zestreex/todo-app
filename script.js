const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Логика смены темы
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
  document.body.classList.add('light-theme');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  let theme = 'dark';
  
  if (document.body.classList.contains('light-theme')) {
    theme = 'light';
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }
  
  localStorage.setItem('theme', theme);
});

// Отрисовка задач
function renderTasks() {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach((task) => {
    const originalIndex = tasks.indexOf(task);
    const li = document.createElement('li');
    if (task.completed) {
      li.classList.add('completed');
    }

    const span = document.createElement('span');
    span.textContent = task.text;
    span.addEventListener('click', () => {
      tasks[originalIndex].completed = !tasks[originalIndex].completed;
      saveAndRender();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      tasks.splice(originalIndex, 1);
      saveAndRender();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateCounter();
}

function updateCounter() {
  const activeCount = tasks.filter(t => !t.completed).length;
  counter.textContent = `Осталось: ${activeCount}`;
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;

  tasks.push({ text: text, completed: false });
  taskInput.value = '';
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveAndRender();
});

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

renderTasks();
