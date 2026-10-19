document.addEventListener("DOMContentLoaded", () => {
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
      const task = tasks.find(el => el.id === taskId);
      task.completed = !task.completed;

      render();
    }
  });

  const listContainer = document.getElementById("todo-list__list-container");
  const tasksList = document.getElementById("todo-list__tasks-list");

  const tasks = [
    { id: 1, text: "Go to the cinema", completed: false, isEditing: false },
    { id: 2, text: "Read the recommended book", completed: false, isEditing: false }
  ];

  render();

  function render() {
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
              <svg class="edit-btn" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5091 6.82736L12.9018 4.43468L12.9025 4.43398C13.2324 4.10414 13.3974 3.93916 13.4592 3.74885C13.5136 3.58133 13.5136 3.40088 13.4592 3.23337C13.3973 3.04292 13.2321 2.87769 12.9018 2.54738L11.4506 1.09625C11.1217 0.767352 10.9569 0.602571 10.7669 0.540824C10.5993 0.486392 10.4189 0.486392 10.2514 0.540824C10.0612 0.602613 9.8962 0.767585 9.5669 1.09695L9.5654 1.09837L7.17272 3.49106L0.5 10.1637V13.5H3.83636L10.5091 6.82736ZM7.17272 3.49106L10.5091 6.82736" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke="#CDCDCD"/>
              </svg>
              <svg class="delete-btn" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z" stroke="#CDCDCD"/>
                <path d="M14.625 3.75H3.375" stroke-linecap="round" stroke="#CDCDCD"/>
                <path d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z" stroke="#CDCDCD"/>
                <path d="M10.5 9V12.75" stroke-linecap="round" stroke="#CDCDCD"/>
                <path d="M7.5 9V12.75" stroke-linecap="round" stroke="#CDCDCD"/>
              </svg>
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
        <span>Empty...</span>
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

    render();
  }
});