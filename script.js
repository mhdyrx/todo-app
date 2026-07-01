"use strict";

const todos = {
  tasks: {},
};

let curTask;
const addBtn = document.querySelector(".add-btn");
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".tasks-list");
const remainings = document.querySelector(".remaining-count");

// Update state function
const updateApp = function () {
  const remainingTodos = Object.values(todos.tasks).reduce(
    (acc, value) => (value === "unchecked" ? (acc += 1) : acc),
    0,
  );
  remainings.textContent = remainingTodos;

  localStorage.setItem("tasks", JSON.stringify(todos.tasks));
};

// HTML Markup creator
const createMarkup = function (value, taskStatus) {
  if (!value) return;

  const markup = `
      <li class="task ${taskStatus === "checked" ? "checked" : ""}">
        <input type="checkbox" class="task-check" ${taskStatus === "checked" ? "checked" : ""}/>

        <p class="task-title">${value}</p>

        <div class="task-btns">
        <button type="button" class="edit-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>

        <button type="button" class="delete-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        </div>
      </li>
  `;
  return markup;
};

// Render tasks from storage
const renderTask = function (obj) {
  Object.entries(obj).forEach((objEl) => {
    const title = objEl[0];
    const checkedStatus = objEl[1];

    const markup = createMarkup(title, checkedStatus);
    if (!markup) return;

    taskList.insertAdjacentHTML("afterbegin", markup);
  });

  updateApp();
};

// Add task event handler
const addAndEditTask = function () {
  if (addBtn.dataset.mode === "add") {
    const markup = createMarkup(taskInput.value, "unchecked");
    if (!markup) return;
    if (todos.tasks[taskInput.value]) {
      console.log("There is another task with the same name!");
      taskInput.value = "";

      return;
    }
    todos.tasks[taskInput.value] = "unchecked";

    taskList.insertAdjacentHTML("afterbegin", markup);
    taskInput.value = "";
  }

  if (addBtn.dataset.mode === "edit") {
    const taskTitle = curTask.querySelector(".task-title");
    const editStatus = todos.tasks[taskTitle.textContent];

    if (!taskInput.value) return;

    delete todos.tasks[taskTitle.textContent];
    todos.tasks[taskInput.value] = editStatus;

    taskTitle.textContent = taskInput.value;
    addBtn.dataset.mode = "add";
    taskInput.value = "";
    taskInput.blur();
  }

  updateApp();
};

// Delete task event handler
const deleteTask = function (task) {
  const taskTitle = task.querySelector(".task-title").textContent;

  delete todos.tasks[taskTitle];
  task.remove();

  updateApp();
};

////////////////////////////
// Events

addBtn.addEventListener("click", addAndEditTask);
taskInput.addEventListener("keydown", function (e) {
  if (e.key !== "Enter") return;
  addAndEditTask();
});

taskList.addEventListener("click", function (e) {
  const deleteBtn = e.target.closest(".delete-btn");
  const checkBtn = e.target.closest(".task-check");
  const editBtn = e.target.closest(".edit-btn");

  if (deleteBtn) {
    const task = deleteBtn.closest(".task");
    deleteTask(task);
  }

  if (checkBtn) {
    const task = checkBtn.closest(".task");
    const taskTitle = task.querySelector(".task-title").textContent;
    task.classList.toggle("checked");

    if (task.classList.contains("checked")) todos.tasks[taskTitle] = "checked";
    else todos.tasks[taskTitle] = "unchecked";
  }

  if (editBtn) {
    const task = editBtn.closest(".task");
    addBtn.dataset.mode = "edit";
    curTask = task;

    taskInput.focus();
    taskInput.value = curTask.querySelector(".task-title").textContent;
  }

  updateApp();
});

// Initial tasks whenever page reloads if exists
const init = function () {
  if (!localStorage.getItem("tasks")) return;
  todos.tasks = JSON.parse(localStorage.getItem("tasks"));
  renderTask(todos.tasks);
  updateApp();
  console.log(todos.tasks);
};

init();
