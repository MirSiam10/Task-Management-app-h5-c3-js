// Select elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const historyList = document.getElementById('historyList');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const darkModeToggle = document.getElementById('darkModeToggle');
const taskModal = document.getElementById('taskModal');
const deleteModal = document.getElementById('deleteModal');
const openTaskModalBtn = document.getElementById('openTaskModal');
const closeTaskModalBtn = taskModal.querySelector('.close');
const closeDeleteModalBtn = deleteModal.querySelector('.close');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');

// Initialize tasks from local storage or set empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let taskToDelete = null;

// Function to save tasks to local storage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Function to render tasks
const renderTasks = () => {
    taskList.innerHTML = '';
    historyList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = createTaskElement(task);
        if (task.completed) {
            historyList.appendChild(taskItem);
        } else {
            taskList.appendChild(taskItem);
        }
    });
};

// Function to create task element
const createTaskElement = (task) => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    if (task.completed) {
        taskItem.classList.add('completed');
    }
    taskItem.innerHTML = `
        <div class="task-name">${task.name}</div>
        <div class="actions">
            <button class="complete-btn" data-task-id="${task.id}" aria-label="Complete task">✔️</button>
            <button class="delete-btn" data-task-id="${task.id}" aria-label="Delete task">❌</button>
        </div>
    `;
    // Add event listeners for complete and delete buttons
    const completeBtn = taskItem.querySelector('.complete-btn');
    completeBtn.addEventListener('click', () => completeTask(task.id));

    const deleteBtn = taskItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => showDeleteModal(task.id));

    return taskItem;
};

// Function to add task
const addTask = (taskName) => {
    const newTask = {
        id: Date.now().toString(),
        name: taskName,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    closeTaskModal();
};

// Function to complete task
const completeTask = (taskId) => {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
};

// Function to show delete modal
const showDeleteModal = (taskId) => {
    taskToDelete = taskId;
    deleteModal.style.display = 'block';
};

// Function to delete task
const deleteTask = () => {
    tasks = tasks.filter(task => task.id !== taskToDelete);
    saveTasks();
    renderTasks();
    closeDeleteModal();
};

// Function to close task modal
const closeTaskModal = () => {
    taskModal.style.display = 'none';
};

// Function to close delete modal
const closeDeleteModal = () => {
    deleteModal.style.display = 'none';
};

// Event listener for form submission
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskName = taskInput.value.trim();
    if (taskName !== '') {
        addTask(taskName);
        taskInput.value = '';
    }
});

// Event listener for open task modal button
openTaskModalBtn.addEventListener('click', () => {
    taskModal.style.display = 'block';
});

// Event listener for close task modal button
closeTaskModalBtn.addEventListener('click', closeTaskModal);

// Event listener for close delete modal button
closeDeleteModalBtn.addEventListener('click', closeDeleteModal);

// Event listener for confirm delete button
confirmDeleteBtn.addEventListener('click', deleteTask);

// Event listener for cancel delete button
cancelDeleteBtn.addEventListener('click', closeDeleteModal);

// Event listeners for navigation
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const page = link.getAttribute('data-page');
        navLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
        pages.forEach(pageElement => {
            pageElement.classList.remove('active');
            if (pageElement.id === page) {
                pageElement.classList.add('active');
            }
        });
    });
});

// Event listener for dark mode toggle
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', darkModeToggle.checked);
    localStorage.setItem('darkMode', darkModeToggle.checked);
});

// Load dark mode preference
if (JSON.parse(localStorage.getItem('darkMode'))) {
    darkModeToggle.checked = true;
    document.body.classList.add('dark-mode');
}

// Initial render of tasks
renderTasks();
