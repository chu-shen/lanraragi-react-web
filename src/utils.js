/* eslint-disable indent */
export const scrollIntoViewByElement = (selector, timeout = 0) => {
  const element = document.querySelector(selector);
  return element
    ? setTimeout(element.scrollIntoView({ block: "end" }), timeout)
    : null;
};

export const scrollByCoordinates = (
  xCoordinate = 0,
  yCoordinate = 0,
  timeout = 0
) =>
  setTimeout(
    window.scrollTo({
      top: yCoordinate,
      left: xCoordinate,
      behavior: "smooth",
    }),
    timeout
  );

export const tagSeperator = (tag) => {
  const separatorIndex = tag.indexOf(":");
  if (separatorIndex === -1) return ["", tag];
  const [tagType] = tag.match(/^[^:]*:\s*/gm);
  const [, tagValue] = tag.split(/^[^:]*:\s*/gm);
  return [tagType.replace(":", ""), tagValue];
};

export const getTagsObjectFromTagsString = (tags) => {
  const tagsArray = tags.split(", ");
  return tagsArray.length
    ? tagsArray.reduce((acc, tag) => {
        const [tagType, tagValue] = tagSeperator(tag);
        const typeToSearchFor = tagType || "other";
        const currentTagTypeValues = acc[typeToSearchFor] ?? [];
        return {
          ...acc,
          [typeToSearchFor]: [...currentTagTypeValues, tagValue],
        };
      }, {})
    : {};
};

export const isValidUrl = (urlString) => {
  try {
    return !!new URL(urlString);
  } catch (e) {
    return false;
  }
};
