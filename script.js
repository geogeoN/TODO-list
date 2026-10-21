document.addEventListener("DOMContentLoaded", () => {
  const deletedStack = [];

  document.body.addEventListener("click", (event) => {
    if (event.target.closest("#todo-list__addition")) {
      const options = {
        onApply(value) { addTask(value) }
      };

      const modal = $.modal(options);
      modal.open();

      document.getElementById("modal__input").focus();
    }

    const taskBody = event.target.closest(".todo-list__task-body");

    if (taskBody) {
      const taskId = Number(taskBody.parentElement.id.replace("todo-list__task", ""));
      const task = tasks.find(el => el.id === taskId && el.isEditing === false);
      task.completed = !task.completed;

      render(tasks);
    }

    const filter = document.getElementById("header__filter");

    if (event.target.closest("#header__filter") || event.target.closest("body") && filter.classList.contains("filter-open")) {
      filter.classList.toggle("filter-open");      
    }

    if (event.target.closest("#header__filter-list")) {
      filter.innerHTML = `
      <img
        src="images/arrow-down.svg"
        alt=""
        class="filter-arrow"
        width="10"
        height="7"
        loading="lazy"
      />
      `;

      if (event.target.id === "filter-list__all") {
        filter.insertAdjacentHTML("afterbegin", `
        <span>ALL</span>
        `);
        filter.classList.remove("filter-open");

        render(tasks);
      }
      if (event.target.id === "filter-list__complete") {
        filter.insertAdjacentHTML("afterbegin", `
        <span>COMPLETE</span>
        `);
        filter.classList.remove("filter-open");

        const tasksFiltered = tasks.filter(element => element.completed === true);
        render(tasksFiltered);
      }
      if (event.target.id === "filter-list__incomplete") {
        filter.insertAdjacentHTML("afterbegin", `
        <span>INCOMPLETE</span>
        `);
        filter.classList.remove("filter-open");

        const tasksFiltered = tasks.filter(element => element.completed === false);
        render(tasksFiltered);
      }
    }

    if (event.target.closest('[data-id="delete-btn"]') && !document.getElementById("todo-list__undo-btn").classList.contains("visible")) {
      const deleteBtn = event.target.closest(".todo-list__task-btn");
      const taskId = Number(deleteBtn.dataset.taskId);
      const undoBtn = document.getElementById("todo-list__undo-btn");
      undoBtn.classList.add("visible");
      
      const task = tasks.find(task => task.id === taskId);
      const pos = tasks.findIndex(task => task.id === taskId);

      deletedStack.push({
        task,
        pos
      });

      undoTimer(undoBtn);
      
      setTimeout(() => {
        deletedStack.length = 0;
      }, 5000);

      tasks = tasks.filter(el => el.id !== taskId);

      render(tasks);
    }

    if (event.target.closest(".todo-list__undo-btn")) {
      const pos = deletedStack[0].pos;
      const task = structuredClone(deletedStack[0].task);
      tasks.splice(pos, 0, task);
      event.target.closest(".todo-list__undo-btn").classList.remove("visible");

      render(tasks);
    }

    if (event.target.closest('[data-id="edit-btn"]')) {
      const editBtn = event.target.closest(".todo-list__task-btn");
      const taskId = Number(editBtn.dataset.taskId);
      const task = tasks.find(el => el.id === taskId);
      task.isEditing = true;

      const taskElement = editBtn.closest(".todo-list__task");
      taskElement.classList.add("edit");
      const taskText = taskElement.querySelector(".todo-list__task-name");
      const taskInput = taskElement.querySelector(".todo-list__task-input");
      const buttons = taskElement.querySelector(".todo-list__task-buttons");
      buttons.innerHTML = `
      <div class="todo-list__task-btn" data-task-id="${taskId}">
        <svg class="accept-btn" width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="stroke0_18_468" fill="white">
          <path d="M4.9978 14.6488L1.72853e-05 9.74757L9.55927 9.85688e-06L14.5571 4.90125L4.9978 14.6488Z"/>
          </mask>
          <path d="M4.9978 14.6488L3.59745 16.0767L5.02539 17.4771L6.42574 16.0492L4.9978 14.6488ZM4.9978 14.6488L6.39816 13.2209L1.40037 8.31963L1.72853e-05 9.74757L-1.40034 11.1755L3.59745 16.0767L4.9978 14.6488ZM14.5571 4.90125L13.1291 3.50089L3.56986 13.2484L4.9978 14.6488L6.42574 16.0492L15.985 6.3016L14.5571 4.90125Z" fill="#6c63ff" mask="url(#stroke0_18_468)"/>
        </svg>
      </div>
      <div class="todo-list__task-btn" data-task-id="${taskId}">
        <svg class="cancel-btn" fill="#e50000" width="25" height="25" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
          <path d="M697.4 759.2l61.8-61.8L573.8 512l185.4-185.4-61.8-61.8L512 450.2 326.6 264.8l-61.8 61.8L450.2 512 264.8 697.4l61.8 61.8L512 573.8z"/>
        </svg>
      </div>
      `;

      taskText.style.display = "none";
      taskInput.style.display = "flex";
      taskInput.focus();
      taskInput.setSelectionRange(taskInput.value.length, taskInput.value.length);
    }

    if (event.target.closest(".accept-btn")) {
      const acceptBtn = event.target.closest(".todo-list__task-btn");
      const taskElement = acceptBtn.closest(".todo-list__task");
      taskElement.classList.remove("edit");
      const taskText = taskElement.querySelector(".todo-list__task-name");
      const taskInput = taskElement.querySelector(".todo-list__task-input");
      const taskId = Number(acceptBtn.dataset.taskId);

      const task = tasks.find(el => el.id === taskId);
      task.text = taskInput.value;
      task.isEditing = false;

      taskText.style.display = "flex";
      taskInput.style.display = "none";

      render(tasks);
    }

    if (event.target.closest(".cancel-btn")) {
      const cancelBtn = event.target.closest(".todo-list__task-btn");
      const taskElement = cancelBtn.closest(".todo-list__task");
      taskElement.classList.remove("edit");
      const taskText = taskElement.querySelector(".todo-list__task-name");
      const taskInput = taskElement.querySelector(".todo-list__task-input");
      const taskId = Number(cancelBtn.dataset.taskId);

      const task = tasks.find(el => el.id === taskId);
      task.isEditing = false;

      taskText.style.display = "flex";
      taskInput.style.display = "none";

      render(tasks);
    }

    if (event.target.closest(".clear-btn")) {
      const textBox = event.target.closest(".header__text-box");
      const searchInput = textBox.querySelector("#header__search-input");
      searchInput.value = "";
      searchInput.focus();
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  document.body.addEventListener("input", (event) => {
    if (event.target.id === "header__search-input") {
      const textBox = event.target.closest("#header__text-box");

      if (event.target.value !== "" && textBox.children.length < 3) {
        textBox.insertAdjacentHTML("beforeend", `
        <svg class="clear-btn" width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6L18 18" stroke="rgba(255 255 255 / .25)" stroke-linecap="round"/>
          <path d="M18 6L6.00001 18" stroke="rgba(255 255 255 / .25)" stroke-linecap="round"/>
        </svg>
        `);
      }
      if (event.target.value === "") {
        const clearBtn = textBox.querySelector(".clear-btn");
        textBox.removeChild(clearBtn);
      }

      tasksInputed = tasks.filter((element) => element.text.toLowerCase().includes(event.target.value.toLowerCase()));

      render(tasksInputed);
    }
  });

  const listContainer = document.getElementById("todo-list__list-container");
  const tasksList = document.getElementById("todo-list__tasks-list");

  let tasks = [
    { id: 1, text: "Go to the cinema", completed: false, isEditing: false },
    { id: 2, text: "Read the recommended book", completed: false, isEditing: false }
  ];

  render(tasks);

  function render(tasks) {
    if (tasks.length > 0) {
      listContainer.innerHTML = `<ul id="todo-list__tasks-list" class="todo-list__tasks-list"></ul>`;
      const list = document.getElementById("todo-list__tasks-list");

      tasks.forEach(element => {
        list.insertAdjacentHTML("beforeend", `
          <li id="todo-list__task${element.id}" class="todo-list__task ${element.completed ? "completed" : ""}">
            <div id="todo-list__task-body${element.id}" class="todo-list__task-body">
              <div class="todo-list__task-checkbox"></div>
              <span class="todo-list__task-name">${element.text}</span>
              <input type="text" 
              id="todo-list__task-input${element.id}" 
              class="todo-list__task-input"
              value="${element.text}">
            </div>
            <div class="todo-list__task-buttons">
              <div class="todo-list__task-btn" data-task-id="${element.id}">
                <svg class="edit-btn" data-id="edit-btn" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5091 6.82736L12.9018 4.43468L12.9025 4.43398C13.2324 4.10414 13.3974 3.93916 13.4592 3.74885C13.5136 3.58133 13.5136 3.40088 13.4592 3.23337C13.3973 3.04292 13.2321 2.87769 12.9018 2.54738L11.4506 1.09625C11.1217 0.767352 10.9569 0.602571 10.7669 0.540824C10.5993 0.486392 10.4189 0.486392 10.2514 0.540824C10.0612 0.602613 9.8962 0.767585 9.5669 1.09695L9.5654 1.09837L7.17272 3.49106L0.5 10.1637V13.5H3.83636L10.5091 6.82736ZM7.17272 3.49106L10.5091 6.82736" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke="#CDCDCD"/>
                </svg>
              </div>
              <div class="todo-list__task-btn" data-task-id="${element.id}">
                <svg class="delete-btn" data-id="delete-btn" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z" stroke="#CDCDCD"/>
                  <path d="M14.625 3.75H3.375" stroke-linecap="round" stroke="#CDCDCD"/>
                  <path d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z" stroke="#CDCDCD"/>
                  <path d="M10.5 9V12.75" stroke-linecap="round" stroke="#CDCDCD"/>
                  <path d="M7.5 9V12.75" stroke-linecap="round" stroke="#CDCDCD"/>
                </svg>
              </div>
            </div>
          </li>
        `);
      });
    }
    else {
      listContainer.innerHTML = `
        <img
          src="images/empty.png"
          alt="Empty Image"
          class="empty"
          width="221"
          height="174"
          loading="lazy"
        />
        <span>Oops... it's empty :(</span>
      `;
    }
  }

  function addTask(value) {
    const newTask = {
      id: Date.now(),
      text: value,
      completed: false,
      isEditing: false
    }

    tasks.push(newTask);

    render(tasks);
  }

  function undoTimer(undoBtn) {
    if (undoBtn.classList.contains("visible")) {
      let secondsRemaining = 5;
      const timer = undoBtn.querySelector(".undo-btn__timer");
      timer.textContent = secondsRemaining;

      const Timer = setTimeout(function run() {
        secondsRemaining--;
        timer.textContent = secondsRemaining;
        
        if (secondsRemaining > 0) {
          setTimeout(run, 1000);
        }
        else {
          undoBtn.classList.remove("visible");
        }
      }, 1000);
    }
  }
});