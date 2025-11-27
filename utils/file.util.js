const formatFileSize = function formatIntToFilesizeWithUnit(size) {
  const sizeScale = [
    {
      name: "bytes",
      minSize: 0,
      convert: (size) => {
        return `${size.toFixed(2)} bytes`;
      },
    },
    {
      name: "kilobytes",
      minSize: 1024,
      convert: (size) => {
        const kiloSize = size / Math.pow(2, 10);
        return `${kiloSize.toFixed(2)} kB`;
      },
    },
    {
      name: "megabytes",
      minSize: Math.pow(1024, 2),
      convert: (size) => {
        const megaSize = size / Math.pow(2, 20);
        return `${megaSize.toFixed(2)} MB`;
      },
    },
  ];
  const defaultSizeFormat = "0 bytes";

  const formattedSize = sizeScale.reduce((previousSizeFormat, currentScale) => {
    if (size < currentScale.minSize) {
      return previousSizeFormat;
    }

    return currentScale.convert(size);
  }, defaultSizeFormat);

  return formattedSize;
};

const formatFilenameToUtf8 = (filename, initialEncoding = "latin1") => {
  return Buffer.from(filename, initialEncoding).toString("utf8");
};

const sliceUrlEndPath = (originalUrl, step = 1) => {
  const hasUrlTrailingSlash = originalUrl.endsWith("/");
  const urlArray = hasUrlTrailingSlash
    ? originalUrl.split("/").slice(0, -1)
    : originalUrl.split("/");

  for (let index = 0; index < step; index++) {
    urlArray.pop();
  }

  return hasUrlTrailingSlash ? urlArray.join("/") + "/" : urlArray.join("/");
};

module.exports = { formatFileSize, formatFilenameToUtf8, sliceUrlEndPath };
