  let tasks = [];

  const taskForm = document.getElementById("taskForm");
  const taskTitle = document.getElementById("taskTitle");
  const taskDesc = document.getElementById("taskDesc");
  const taskList = document.getElementById("taskList");

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title: taskTitle.value.trim(),
      description: taskDesc.value.trim(),
      completed: false,
    };

    tasks.push(newTask);
    renderTasks();
    taskForm.reset();
  });

  function toggleTask(id) {
    tasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
  }

  function filterTasks(status) {
    renderTasks(status);
  }

  function renderTasks(filter = "all") {
    taskList.innerHTML = "";

    let filteredTasks = tasks;
    if (filter === "completed") {
      filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === "pending") {
      filteredTasks = tasks.filter(task => !task.completed);
    }

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `<p class="text-center text-muted">No tasks found.</p>`;
      return;
    }

    filteredTasks.forEach(task => {
      const card = document.createElement("div");
      card.className = `card mb-3 shadow-sm ${task.completed ? "task-completed" : ""}`;

      card.innerHTML = `
        <div class="card-body d-flex align-items-center justify-content-between">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${task.id})" />
          </div>
          <div class="flex-grow-1 mx-3">
            <h5 class="mb-1">${task.title}</h5>
            <p class="mb-1">${task.description}</p>
            <small class="text-secondary">${task.completed ? "Completed" : "Pending"}</small>
          </div>
          <div>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">Delete</button>
          </div>
        </div>
      `;
      taskList.appendChild(card);
    });
  }