"use strict";

const todos = {
  tasks: {},
};

const TASK_STATUS = {
  CHECKED: "checked",
  UNCHECKED: "unchecked",
};

const BUTTON_MODE = {
  ADD: "add",
  EDIT: "edit",
};

let curTask;
const addBtn = document.querySelector(".add-btn");
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".tasks-list");
const remainings = document.querySelector(".remaining-count");

const addAndEditButtonState = function () {
  addBtn.removeChild(addBtn.querySelector("svg"));
  const editIcon = `<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
      />
    </svg>`;

  const addIcon = `<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="add-svg"
    >
      <path
        fill-rule="evenodd"
        d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
        clip-rule="evenodd"
      />
    </svg>`;

  addBtn.insertAdjacentHTML(
    "afterbegin",
    addBtn.dataset.mode === BUTTON_MODE.EDIT ? editIcon : addIcon,
  );
};

// Update state function
const updateApp = function () {
  const remainingTodos = Object.values(todos.tasks).reduce(
    (acc, value) => (value === TASK_STATUS.UNCHECKED ? (acc += 1) : acc),
    0,
  );
  remainings.textContent = remainingTodos;

  localStorage.setItem("tasks", JSON.stringify(todos.tasks));
  addAndEditButtonState();
};

// HTML Markup creator
const createMarkup = function (value, taskStatus) {
  if (!value) return;

  const markup = `
      <li class="task ${taskStatus === TASK_STATUS.CHECKED ? TASK_STATUS.CHECKED : ""}">
        <input type="checkbox" class="task-check" ${taskStatus === TASK_STATUS.CHECKED ? TASK_STATUS.CHECKED : ""}/>

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
};

const cancelEdit = function () {
  curTask = null;
  taskInput.value = "";
  taskInput.blur();
  addBtn.dataset.mode = BUTTON_MODE.ADD;
};

const addTask = function () {
  const markup = createMarkup(taskInput.value, TASK_STATUS.UNCHECKED);
  if (!markup) return;
  if (todos.tasks[taskInput.value]) {
    console.log("There is another task with the same name!");
    taskInput.value = "";

    return;
  }
  todos.tasks[taskInput.value] = TASK_STATUS.UNCHECKED;

  taskList.insertAdjacentHTML("afterbegin", markup);
  taskInput.value = "";
};

const getTaskTitle = function (task) {
  const taskTitle = task.querySelector(".task-title");
  return taskTitle;
};

const getClosestTask = function (btn) {
  const task = btn.closest(".task");
  return task;
};

const editTask = function () {
  const taskTitle = getTaskTitle(curTask);
  const editStatus = todos.tasks[taskTitle.textContent];
  if (
    todos.tasks[taskInput.value] &&
    taskTitle.textContent !== taskInput.value
  ) {
    console.log("There is another task with the same name!");

    return;
  }

  if (!taskInput.value) return;

  delete todos.tasks[taskTitle.textContent];
  todos.tasks[taskInput.value] = editStatus;

  taskTitle.textContent = taskInput.value;

  cancelEdit();
};

// Add task event handler
const handleMainButton = function () {
  if (addBtn.dataset.mode === BUTTON_MODE.ADD) addTask();

  if (addBtn.dataset.mode === BUTTON_MODE.EDIT) editTask();

  updateApp();
};

// Delete task event handler
const deleteTask = function (task) {
  const taskTitle = getTaskTitle(task).textContent;

  delete todos.tasks[taskTitle];
  task.remove();

  updateApp();
};

////////////////////////////
// Events

taskInput.addEventListener("keydown", function (e) {
  if (e.key !== "Escape") return;
  if (addBtn.dataset.mode === BUTTON_MODE.ADD) return;

  cancelEdit();

  updateApp();
});

addBtn.addEventListener("click", handleMainButton);
taskInput.addEventListener("keydown", function (e) {
  if (e.key !== "Enter") return;
  handleMainButton();
});

taskList.addEventListener("click", function (e) {
  const deleteBtn = e.target.closest(".delete-btn");
  const checkBtn = e.target.closest(".task-check");
  const editBtn = e.target.closest(".edit-btn");

  if (deleteBtn) {
    const task = getClosestTask(deleteBtn);
    deleteTask(task);
  }

  if (checkBtn) {
    const task = getClosestTask(checkBtn);

    const taskTitle = getTaskTitle(task).textContent;
    task.classList.toggle("checked");

    if (task.classList.contains("checked"))
      todos.tasks[taskTitle] = TASK_STATUS.CHECKED;
    else todos.tasks[taskTitle] = TASK_STATUS.UNCHECKED;
  }

  if (editBtn) {
    const task = getClosestTask(editBtn);
    curTask = task;

    const taskTitle = getTaskTitle(curTask).textContent;
    addBtn.dataset.mode = BUTTON_MODE.EDIT;

    taskInput.focus();
    taskInput.value = taskTitle;
  }

  updateApp();
});

// Initial tasks whenever page reloads if exists
const init = function () {
  if (!localStorage.getItem("tasks")) return;
  addBtn.dataset.mode = BUTTON_MODE.ADD;
  todos.tasks = JSON.parse(localStorage.getItem("tasks"));
  renderTask(todos.tasks);
  updateApp();
};

init();
