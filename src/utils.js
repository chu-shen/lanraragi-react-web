/* eslint-disable function-paren-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable indent */
import { trimEnd } from "lodash";
import { getUseHttps } from "./storage/requests";
import { GENERAL_TAG_TYPE } from "./constants";

export const scrollIntoViewByElement = (selector, timeout = 0) => {
  const element = document.querySelector(selector);
  return element ? setTimeout(element.scrollIntoView({ block: "end" }), timeout) : null;
};

export const scrollByCoordinates = (xCoordinate = 0, yCoordinate = 0, timeout = 0) =>
  setTimeout(
    window.scrollTo({
      top: yCoordinate,
      left: xCoordinate,
      behavior: "smooth",
    }),
    timeout
  );

const removeStartingBlankSpaceIfPresent = (str) =>
  str.indexOf(" ") === 0 ? `${str.slice(1)}` : str;

/**
 * For strings with one or more commas following the initial character
 *
 * Ex: 'one,two,three' would become 'one, two, three'
 */
export const spaceAfterComma = (str) => {
  const splitString = str.split(",");
  return splitString
    .map((arrStr, ind) => (arrStr.indexOf(" ") !== 0 && ind !== 0 ? ` ${arrStr}` : arrStr))
    .join(",");
};

export const tagSeperator = (tag) => {
  const separatorIndex = tag.indexOf(":");
  if (separatorIndex === -1) return ["", tag];
  const [tagType] = tag.match(/^[^:]*:\s*/gm);
  const [, tagValue] = tag.split(/^[^:]*:\s*/gm);
  return [trimEnd(tagType.replace(":", "")), trimEnd(tagValue)];
};

export const getTagsObjectFromTagsString = (tags) => {
  const tagsArray = tags.split(",");
  return tagsArray.length
    ? tagsArray.reduce((acc, tag) => {
        const [tagType, tagValue] = tagSeperator(removeStartingBlankSpaceIfPresent(tag));
        const typeToSearchFor = tagType || GENERAL_TAG_TYPE;
        const currentTagTypeValues = acc[typeToSearchFor] ?? [];
        const exists = currentTagTypeValues.includes(tagValue);
        return {
          ...acc,
          [typeToSearchFor]: [...currentTagTypeValues, ...(exists ? [] : [tagValue])],
        };
      }, {})
    : {};
};

export const stringifyTagsObject = (tagsObject) => {
  const tagsObjectKeys = Object.keys(tagsObject);
  return tagsObjectKeys.reduce((cumulator, currentTagType, ind) => {
    const tagTypeArrayAsString =
      currentTagType !== GENERAL_TAG_TYPE
        ? tagsObject[currentTagType].map((tag) => `${currentTagType}:${tag}`).join(", ")
        : tagsObject[currentTagType].join(", ");
    const endComma = ind !== tagsObjectKeys.length - 1 ? ", " : "";
    return cumulator + tagTypeArrayAsString + endComma;
  }, "");
};

export const isValidUrl = (urlString) => {
  try {
    return !!new URL(urlString);
  } catch (e) {
    return false;
  }
};

export const firstLetterToUppercase = (word = "") => word.slice(0, 1).toUpperCase() + word.slice(1);

export const getNewSearchArchivesArrayAfterDeletingArchiveId = (searchArchives, archiveId) => {
  const arcIndex = searchArchives.findIndex(({ arcid }) => arcid === archiveId);
  if (arcIndex === -1) return [...searchArchives];
  const newArchives = [...searchArchives];
  newArchives.splice(arcIndex, 1);
  return newArchives;
};

export const httpOrHttps = () => (getUseHttps() ? "https://" : "http://");
