"use strict";

const todos = {
  tasks: {},
};

const addBtn = document.querySelector(".add-btn");
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".tasks-list");
const remainings = document.querySelector(".remaining-count");

const updateApp = function () {
  const remainingTodos = Object.values(todos.tasks).reduce(
    (acc, value) => (value === "unchecked" ? (acc += 1) : acc),
    0,
  );
  remainings.textContent = remainingTodos;

  localStorage.setItem("tasks", JSON.stringify(todos.tasks));
};

const createMarkup = function (value, taskStatus) {
  if (!value) return;

  const markup = `
    <li class="task ${taskStatus === "checked" ? "checked" : ""}">
        <input type="checkbox" class="task-check" ${taskStatus === "checked" ? "checked" : ""}/>

        <p class="task-title">${value}</p>
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
      </li>
  `;
  return markup;
};

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

const addTask = function () {
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

  updateApp();
};

const deleteTask = function (task) {
  const taskTitle = task.querySelector(".task-title").textContent;

  delete todos.tasks[taskTitle];
  task.remove();

  updateApp();
};

addBtn.addEventListener("click", addTask);
taskList.addEventListener("click", function (e) {
  const btn = e.target.closest(".delete-btn");
  const check = e.target.closest(".task-check");

  if (btn) {
    const task = btn.closest(".task");
    deleteTask(task);
  }

  if (check) {
    const task = check.closest(".task");
    const taskTitle = task.querySelector(".task-title").textContent;
    task.classList.toggle("checked");

    if (task.classList.contains("checked")) todos.tasks[taskTitle] = "checked";
    else todos.tasks[taskTitle] = "unchecked";
  }

  updateApp();
});

const init = function () {
  if (!localStorage.getItem("tasks")) return;
  todos.tasks = JSON.parse(localStorage.getItem("tasks"));
  renderTask(todos.tasks);
};

// localStorage.clear();
init();
