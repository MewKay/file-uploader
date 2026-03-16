const limitButton = document.querySelector(".limit-button");
const limitModal = document.querySelector(".limit-modal");
const confirmLimitButton = document.querySelector(".confirm-limit");
const closeLimitModalButton = document.querySelector(
  ".limit-modal .close-modal-button",
);

limitButton.addEventListener("click", () => {
  limitModal.showModal();
});
confirmLimitButton.addEventListener("click", () => {
  limitModal.close();
});
closeLimitModalButton.addEventListener("click", () => {
  limitModal.close();
});
