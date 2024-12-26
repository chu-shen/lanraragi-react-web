import React from "react";
import { Paper, Grid } from "@mui/material";
import { ArchiveActionButtons } from "./fragments/archive-action-buttons";
import { EditArchiveButton } from "./fragments/edit-archive-button";
import { ArchiveMetadataButtons } from "./fragments/archive-metadata-buttons";
import { getTagsObjectFromTagsString, httpOrHttps } from "../../utils";
import { Rating } from "../rating/rating";
import { DateTime } from "luxon";
import { useArchiveLogic } from "./useArchiveLogic";

export const Archive = ({
  baseUrl,
  currentArchiveId,
  id,
  index,
  isSearch,
  onEditClick,
  onInfoClick,
  numOfArchivesRendered,
  tags,
  title,
  isnew,
  pagecount,
}) => {
  const { onLoad, onTitleClick, rating, ref, showFullTitle, src } =
    useArchiveLogic({
      baseUrl,
      currentArchiveId,
      id,
      numOfArchivesRendered,
      tags,
    });

  const tagsAsObject = getTagsObjectFromTagsString(tags);
  var date_added = tagsAsObject?.date_added ?? '';
  date_added = DateTime.fromSeconds(Number(date_added)).toLocaleString()
  // TODO: 调整为可配置
  const language = tagsAsObject?.语言 ?? [];

  return (
    <Grid xs={1} sm={1} md={1} lg={1} xl={1} item>
      <Paper
        className="h-full flex flex-col justify-between relative bg-[#363940]"
        id={`archive_${id}`}
      >
        <div className="overflow-hidden min-h-[300px] p-2 flex flex-row justify-center"
          style={{ position: 'relative' }}>
          <img
            className="object-contain w-max max-w-full max-h-[300px] rounded"
            id={`archive-img-${index}`}
            alt={`thumbnail for ${title}`}
            src={src}
            onLoad={onLoad}
          />
          {Boolean(isnew == 'true') ? <div style={{ position: 'absolute', zIndex: 2, right: '0px', top: '0px', backgroundColor: "blue" }}>NEW!</div> : <div></div>}
          <div style={{ position: 'absolute', zIndex: 2, right: '0px', bottom: '0px', backgroundColor: "black" }}>{pagecount}</div>
          <div style={{ position: 'absolute', zIndex: 2, left: '0px', bottom: '0px', backgroundColor: "black" }}>{date_added}</div>
        <div style={{ position: 'absolute', zIndex: 2, left: '0px', top: '0px', backgroundColor: "black" }}>{language[0]}</div>
        </div>
        <div className="p-2">
          <button className="w-full" type="button" onClick={onTitleClick}>
            <a
              className={`normal-case font-bold m-0 text-sm ${
                showFullTitle ? "" : "clamp"
              }`}
              id={`archive-text-${index}`}
              ref={ref}
              href={`${httpOrHttps()}${baseUrl}/reader?id=${id}`}
              target="_blank"
            >
              {title}
            </a>
          </button>
        </div>
        {/* {rating && (
          <div>
            <Rating readOnly arcId={id} size="small" ratingProp={rating} />
          </div>
        )} */}
        <ArchiveMetadataButtons
          id={id}
          tagsAsObject={tagsAsObject}
        />
        <ArchiveActionButtons
          id={id}
          title={title}
          currentArchiveId={currentArchiveId}
          isSearch={isSearch}
          onInfoClick={onInfoClick}
        />
        <EditArchiveButton id={id} title={title} onEditClick={onEditClick} />
      </Paper>
    </Grid>
  );
};

export default Archive;
