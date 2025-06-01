const createButton = document.querySelector(".new-folder-button");
const newFolderDialog = document.querySelector(".new-folder-modal");

const renameButtons = document.querySelectorAll(".rename-button");
const renameDialogButtonPairs = Array.from(renameButtons).map((button) => {
  const container = button.closest("span");
  const dialog = container.querySelector(".rename-modal");

  return {
    button,
    dialog,
  };
});

const uploadButton = document.querySelector(".open-upload-modal-button");
const uploadModal = document.querySelector(".file-upload-modal");

const closeButtons = document.querySelectorAll(".close-modal-button");

createButton.addEventListener("click", () => newFolderDialog.showModal());
renameDialogButtonPairs.forEach((pair) =>
  pair.button.addEventListener("click", () => pair.dialog.showModal()),
);
uploadButton.addEventListener("click", () => uploadModal.showModal());
closeButtons.forEach((button) => {
  const modal = button.closest("dialog");

  button.addEventListener("click", () => modal.close());
});
