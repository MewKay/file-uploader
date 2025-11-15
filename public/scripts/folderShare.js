const toggleShareLinkButton = document.querySelector(
  ".share-folder.toggle-link",
);
const shareFolderContainer = document.querySelector(".share-folder-container");

toggleShareLinkButton.addEventListener("click", () =>
  shareFolderContainer.classList.toggle("hidden"),
);
