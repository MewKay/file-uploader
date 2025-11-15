const toggleShareLinkButton = document.querySelector(
  ".share-folder.toggle-link",
);
const shareFolderContainer = document.querySelector(".share-folder-container");
const copyButton = document.querySelector(".copy-button");
const shareFolderLink = document.querySelector(
  ".share-link-container",
).textContent;

toggleShareLinkButton.addEventListener("click", () =>
  shareFolderContainer.classList.toggle("hidden"),
);

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareFolderLink);

    copyButton.className = "copy-button success";
  } catch (error) {
    copyButton.className = "copy-button failure";
    console.error("Copy shared folder link failed", error);
  } finally {
    const TWO_MINUTES = 1000 * 60 * 2;
    copyButton.disabled = true;

    setTimeout(() => {
      copyButton.className = "copy-button idle";
      copyButton.disabled = false;
    }, TWO_MINUTES);
  }
});
