import { Grid } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Archive from "../archive/archive";
import { ArchiveInfoDialog } from "../dialogs/fragments/archive-info-dialog";
import { PageButtons } from "./fragments/page-buttons";
import { getBaseUrl } from "../../storage/requests";
import { getCurrentArchiveId } from "../../app/selectors";
import { updateInfoDialogArchiveId } from "../../app/slice";
import { getNumArchivePerRow } from "../../storage/archives";

export const ArchiveList = ({
  archives = [],
  display,
  sliceToRender = [0, null],
  isSearch = false,
}) => {
  const dispatch = useDispatch();
  const currentArchiveId = useSelector(getCurrentArchiveId);
  const [archiveInfoModalState, updateArchiveInfoModalState] = useState({
    open: false,
    arcId: "",
  });
  const secondSliceValue = sliceToRender[1] ?? archives.length;
  const baseUrl = getBaseUrl();
  const columns = getNumArchivePerRow();

  return (
    <div
      className="full-height"
      style={{
        display,
        overflowY: "scroll",
      }}
    >
      <div style={{ paddingTop: "2rem", paddingBottom: "75svh" }}>
        <Grid
          container
          columns={columns}
          spacing={2}
          sx={{
            padding: "0 1rem",
            marginTop: 0,
          }}
        >
          <div id="archives-top" />
          {isSearch && <PageButtons />}
          {archives
            .slice(sliceToRender[0], secondSliceValue)
            .map((archive, idx) => {
              const { arcid, title } = archive;
              const onInfoClick = () => {
                dispatch(updateInfoDialogArchiveId(arcid));
                updateArchiveInfoModalState({ open: true, arcId: arcid });
              };
              return (
                <Grid
                  key={arcid}
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  xl={1}
                  item
                  sx={{
                    paddingTop: "0 !important",
                    paddingBottom: "2rem",
                  }}
                >
                  <Archive
                    index={idx}
                    id={arcid}
                    title={title}
                    onInfoClick={onInfoClick}
                    baseUrl={baseUrl}
                    currentArchiveId={currentArchiveId}
                  />
                </Grid>
              );
            })}
          {isSearch && <PageButtons />}
        </Grid>
      </div>
      <ArchiveInfoDialog
        onClose={() =>
          updateArchiveInfoModalState({ ...archiveInfoModalState, open: false })
        }
        open={archiveInfoModalState.open}
        arcId={archiveInfoModalState.arcId}
      />
    </div>
  );
};
