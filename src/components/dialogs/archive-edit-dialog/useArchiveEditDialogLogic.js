import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getArchiveMetaData, {
  updateArchiveMetadata,
} from "../../../requests/metadata";
import { getArchiveCategories } from "../../../requests/categories";
import { getVisibleSection } from "../../../app/selectors";
import { updateArchiveTags, updateDisplaySnackbar } from "../../../app/slice";

export const useArchiveEditDialogModalLogic = ({ onCloseProp, arcId }) => {
  const dispatch = useDispatch();
  const openPage = useSelector(getVisibleSection);
  const [archiveData, setArchiveData] = useState({});
  const [updateResponse, setUpdateResponse] = useState({
    error: "",
    operation: "update_metadata",
    success: 0,
    successMessage: null,
  });
  const archiveDataReady = archiveData?.tags && archiveData?.title;

  const onClose = useCallback(() => {
    if (onCloseProp) onCloseProp();
  }, [onCloseProp]);

  const onUpdateButtonClick = useCallback(() => {
    updateArchiveMetadata({
      id: arcId,
      title: archiveData?.title,
      tags: archiveData?.tags,
    })
      .then((res) => {
        if (res?.success === 1) {
          setUpdateResponse({
            ...res,
            successMessage:
              "Congrats! The archive's information has been updated!",
          });
          dispatch(
            updateArchiveTags({
              arcId,
              searchOrRandom: openPage,
              tags: archiveData?.tags,
            })
          );
          onClose();
          dispatch(
            updateDisplaySnackbar({
              open: true,
              type: "UPDATE_ARCHIVE_INFO_SUCCESS",
            })
          );
        } else {
          onClose();
          updateDisplaySnackbar({
            open: true,
            type: "UPDATE_ARCHIVE_INFO_FAILURE",
            severity: "error",
          });
          console.log(res?.error ?? "Unknow error with updating archive info");
        }
      })
      .catch((err) => {
        setUpdateResponse({
          ...updateResponse,
          error: "Sorry, something seems to have gone wrong.",
        });
        onClose();
        updateDisplaySnackbar({
          open: true,
          type: "UPDATE_ARCHIVE_INFO_FAILURE",
          severity: "error",
        });
        console.log(err);
      });
  }, [archiveData, onClose, dispatch, arcId]);

  useEffect(() => {
    const getArchiveData = async () => {
      const metaData = await getArchiveMetaData(arcId);
      const categoriesData = await getArchiveCategories(arcId);
      setArchiveData({
        ...metaData,
        categories: categoriesData?.categories ?? [],
      });
    };

    if (arcId) getArchiveData();
  }, [arcId, setArchiveData]);

  return {
    onClose,
    archiveData,
    setArchiveData,
    onUpdateButtonClick,
    archiveDataReady,
  };
};
