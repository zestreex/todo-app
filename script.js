const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Загружаем задачи из памяти браузера при открытии страницы
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Функция для отрисовки задач на экране
function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) {
      li.classList.add('completed');
    }

    const span = document.createElement('span');
    span.textContent = task.text;
    // Клик по тексту переключает статус выполнения
    span.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveAndRender();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.classList.add('delete-btn');
    // Клик по крестику удаляет задачу
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveAndRender();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Функция добавления новой задачи
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return; // Если поле пустое, ничего не делаем

  tasks.push({ text: text, completed: false });
  taskInput.value = '';
  saveAndRender();
}

// Сохранение в LocalStorage и перерисовка списка
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Обработчики событий
addBtn.addEventListener('click', addTask);

// Добавление по нажатию клавиши Enter
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Первичный запуск отрисовки при загрузке
renderTasks();