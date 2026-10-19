document.addEventListener("DOMContentLoaded", () => {
  
  const tasksList = document.getElementById("todo-list__tasks-list");

  const tasks = [
    { id: 1, text: "Go to the cinema", completed: false },
    { id: 2, text: "Read the recommended book", completed: false }
  ]

  function render() {

  }

  // Временный доступ к модальному окну
  const newNoteBtn = document.getElementById("todo-list__addition");

  newNoteBtn.addEventListener("click", () => {
    const modal = $.modal();
    modal.open();
  });


});