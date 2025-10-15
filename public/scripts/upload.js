const { fileConstraints, formatFileSize } = imports;

const uploadZone = document.querySelector(".upload-zone");
const fileInput = document.querySelector("#file-input");
const clearFileButton = document.querySelector("button.clear-file");
const templates = {
  noFile: document.querySelector("#no-file-template").content,
  invalidFileType: document.querySelector("#invalid-file-type-template")
    .content,
  invalidFileSize: document.querySelector("#invalid-file-size-template")
    .content,
  fileInfo: document.querySelector("#file-info-template").content,
};

const cloneTemplate = (template, fileToInsert = null) => {
  const container = template.cloneNode(true);

  if (fileToInsert) {
    const nameInfo = container.querySelector(".file-info.name");
    const sizeInfo = container.querySelector(".file-info.size");

    nameInfo.textContent = fileToInsert.name;
    if (sizeInfo) sizeInfo.textContent = formatFileSize(fileToInsert.size);
  }

  return container;
};

const isFileValidMimetype = (mimetype) => {
  const { fileTypes, documents, archives } = fileConstraints.validMimetypes;
  const fileType = mimetype.split("/")[0];

  return (
    fileTypes.includes(fileType) ||
    documents.includes(mimetype) ||
    archives.includes(mimetype)
  );
};

const isFileValidSize = (size) => {
  return size < fileConstraints.fileSizeLimit;
};

// Event Listeners
window.addEventListener("DOMContentLoaded", () => {
  uploadZone.prepend(cloneTemplate(templates.noFile));
});

fileInput.addEventListener("change", () => {
  uploadZone.removeChild(uploadZone.firstElementChild);

  const selectedFile = fileInput.files[0];

  if (!selectedFile) {
    uploadZone.prepend(cloneTemplate(templates.noFile));
  } else if (!isFileValidMimetype(selectedFile.type)) {
    uploadZone.prepend(cloneTemplate(templates.invalidFileType, selectedFile));
  } else if (!isFileValidSize(selectedFile.size)) {
    uploadZone.prepend(cloneTemplate(templates.invalidFileSize, selectedFile));
  } else {
    uploadZone.prepend(cloneTemplate(templates.fileInfo, selectedFile));
  }
});

clearFileButton.addEventListener("click", () => {
  uploadZone.removeChild(uploadZone.firstElementChild);
  uploadZone.prepend(cloneTemplate(templates.noFile));
});
