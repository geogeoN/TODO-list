// Функция, создающая модальное окно
function _createModal() {
  const modal = document.createElement("div");

  modal.classList.add("modal");
  modal.insertAdjacentHTML("afterbegin", `
    <div class="modal__overlay">
        <div class="modal__window">
          <div class="modal__header">
            <h1 class="modal__title">NEW NOTE</h1>
          </div>
          <div class="modal__body">
            <input type="text" id="modal__input" class="modal__input" placeholder="Input your note..." required></input>
          </div>
          <div class="modal__footer">
            <div id="modal__cancel-btn" class="modal__btn modal__cancel-btn">cancel</div>
            <div id="modal__apply-btn" class="modal__btn modal__apply-btn">apply</div>
          </div>
        </div>
      </div>
  `);

  document.body.append(modal);
    
  return modal;
}

// Метод, предоставляющий управление модальным окном
$.modal = function (options = {}) {
  const ANIMATION_SPEED = 150;
  const $modal = _createModal();
  let closing = false;
  let closed = true;
  
  const destroy = () => {
    $modal.remove();
  }

  $modal.addEventListener("click", (e) => {
    const input = document.getElementById("modal__input");

    if (e.target.id === "modal__apply-btn") {
      if (input.hasAttribute("required") && !input.value.trim()) {
        input.reportValidity();
        return;
      }

      const value = input.value;

      if (typeof options.onApply === "function") {
        options.onApply(value);
      }

      modal.close();
    }

    if (e.target.id === "modal__cancel-btn" || e.target.classList.contains("modal__overlay")) {
      modal.close();
    }
  });

  const modal = {
    open() {
      if (closed) {
        closed = false;
        if (!closing) {
          setTimeout(() => {
            $modal.classList.add("open");
          }, 0);
        }
      } 
    },
    close() {
      closing = true;

      $modal.classList.remove("open");
      $modal.classList.add("hide");

      setTimeout(() => {
        $modal.classList.remove("hide");

        closing = false;
        closed = true;

        destroy();
      }, ANIMATION_SPEED);
    },
  }

  return modal;
};