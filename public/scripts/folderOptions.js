const createButton = document.querySelector(".new-folder-button");
const newFolderDialog = document.querySelector(".new-folder-modal");

const renameButtons = document.querySelectorAll(".rename-button");

const renameDialogButtonPairs = Array.from(renameButtons).map((button) => {
  const container = button.closest("span");
  const dialog = container.querySelector(".rename-dialog");

  return {
    button,
    dialog,
  };
});

createButton.addEventListener("click", () => newFolderDialog.showModal());

renameDialogButtonPairs.forEach((pair) =>
  pair.button.addEventListener("click", () => pair.dialog.showModal()),
);
