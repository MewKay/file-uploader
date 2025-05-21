const renameButtons = document.querySelectorAll(".rename-button");

const renameDialogButtonPairs = Array.from(renameButtons).map((button) => {
  const container = button.closest("span");
  const dialog = container.querySelector(".rename-dialog");

  return {
    button,
    dialog,
  };
});

renameDialogButtonPairs.forEach((pair) =>
  pair.button.addEventListener("click", () => pair.dialog.showModal()),
);
