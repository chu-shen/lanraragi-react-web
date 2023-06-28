import axios from "axios";
import { HEADERS, METADATA_URL } from "./constants";
import { getBaseUrl, getApiKey } from "../storage/requests";

const config = {
  method: "get",
  headers: HEADERS,
};

export const getArchiveMetaData = async (arcId) => {
  if (!arcId) return Error("No archive Id supplied");
  const metadata = await axios({
    ...config,
    url: `http://${getBaseUrl()}${METADATA_URL.replace(":id", arcId)}`,
  });
  return metadata.data;
};

export const updateArchiveMetaData = async (arcId, newTags) => {
  if (!arcId) return Error("No archive Id supplied");
  axios({
    method: "put",
    url: `http://${getBaseUrl()}${METADATA_URL.replace(":id", arcId)}`,
    params: { key: `${getApiKey()}`, tags: newTags }
  })
    .then((response) => response.data)
    .catch((error) => {
      return { error: "Sorry, something went wrong" };
    });
};

export default getArchiveMetaData;
