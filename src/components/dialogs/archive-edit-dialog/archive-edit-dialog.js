/* eslint-disable function-paren-newline */
import React from "react";
import { Button, Grid, TextField } from "@mui/material";
import { BaseDialog } from "../base-dialog";
import { Loading } from "../../loading/loading";
import { useArchiveEditDialogModalLogic } from "./useArchiveEditDialogLogic";

export const ArchiveEditDialog = ({ arcId, onCloseProp, open }) => {
  const {
    onClose,
    onUpdateButtonClick,
    archiveData,
    setArchiveData,
    archiveDataReady,
  } = useArchiveEditDialogModalLogic({ onCloseProp, arcId });

  return (
    <BaseDialog
      title="Edit Archive Info"
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="md"
    >
      <Grid container spacing={4} sx={{ padding: "2rem 0 1rem 0" }}>
        {archiveDataReady ? (
          <>
            <Grid item xs={12}>
              <TextField
                id="edit-title-inputfield"
                label="Title"
                value={archiveData?.title}
                placeholder="Current Title"
                onChange={(e) =>
                  setArchiveData({ ...archiveData, title: e.target.value })
                }
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="edit-tags-inputfield"
                label="Tags"
                multiline
                rows={8}
                value={archiveData?.tags}
                placeholder="Current Tags"
                onChange={(e) =>
                  setArchiveData({ ...archiveData, tags: e.target.value })
                }
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container justifyContent="center">
                <Grid item xs={6}>
                  <Button fullWidth onClick={onUpdateButtonClick}>
                    Update Archive
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <Loading label="Getting archive info" loading centerText />
        )}
      </Grid>
    </BaseDialog>
  );
};
