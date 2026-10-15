const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Отрисовка задач с учетом фильтра
function renderTasks() {
  taskList.innerHTML = '';

  // Фильтруем задачи
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // 'all'
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

// Обновление счетчика невыполненных дел
function updateCounter() {
  const activeCount = tasks.filter(t => !t.completed).length;
  counter.textContent = `Осталось: ${activeCount}`;
}

// Добавление новой задачи
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;

  tasks.push({ text: text, completed: false });
  taskInput.value = '';
  saveAndRender();
}

// Сохранение и перерисовка
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Переключение фильтров
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Удаление всех завершённых задач
clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveAndRender();
});

// События ввода
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Первичная отрисовка
renderTasks();
