const { fileConstraints, formatFileSize } = imports;

const uploadZone = document.querySelector(".upload-zone");
const fileInput = document.querySelector("#file-input");
const templates = {
  noFile: document.querySelector("#no-file-template").content,
  invalidFile: document.querySelector("#invalid-file-template").content,
  fileInfo: document.querySelector("#file-info-template").content,
};

const cloneTemplate = (template, fileToInsert = null) => {
  const container = template.cloneNode(true);

  if (fileToInsert) {
    const nameInfo = container.querySelector(".file-info.name");
    const sizeInfo = container.querySelector(".file-info.size");

    nameInfo.textContent = fileToInsert.name;
    sizeInfo.textContent = formatFileSize(fileToInsert.size);
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

window.addEventListener("DOMContentLoaded", () => {
  uploadZone.prepend(templates.noFile);
});

fileInput.addEventListener("change", () => {
  uploadZone.removeChild(uploadZone.firstElementChild);

  const selectedFile = fileInput.files[0];

  if (!selectedFile) {
    uploadZone.prepend(cloneTemplate(templates.noFile));
  } else if (!isFileValidMimetype(selectedFile.type)) {
    uploadZone.prepend(cloneTemplate(templates.invalidFile));
  } else {
    uploadZone.prepend(cloneTemplate(templates.fileInfo, selectedFile));
  }
});
