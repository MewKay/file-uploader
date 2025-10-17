const toggleButtons = document.querySelectorAll(".toggle-action");
const actionContainers = document.querySelectorAll(".folder-button-container");

window.addEventListener("click", (event) => {
  const clickedElement = event.target;

  for (let index = 0; index < toggleButtons.length; index++) {
    toggleButtons[index].classList.remove("hidden");
    actionContainers[index].classList.add("hidden");
  }

  const clickedToggleButton = clickedElement.closest(".toggle-action");

  if (clickedToggleButton) {
    const clickedButtonContainer = clickedElement
      .closest(".folder-action")
      .querySelector(".folder-button-container");

    clickedToggleButton.classList.add("hidden");
    clickedButtonContainer.classList.remove("hidden");
  }
});
