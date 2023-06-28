import React, { useCallback, useEffect, useRef, useState } from "react";
import { Paper } from "@mui/material";
import { useImageSize } from "react-image-size";
import { THUMBNAIL_URL } from "../../requests/constants";
import { Loading } from "../loading/loading";
import { ARCHIVE_STYLES } from "./constants";
import { ArchiveActionButtons } from "./fragments/archive-action-buttons";
import { ArchiveMetadataButtons } from "./fragments/archive-metadata-buttons";
import { getTagsObjectFromTagsString } from "../../utils";
import { DateTime } from "luxon";

const styles = ARCHIVE_STYLES;

export const Archive = ({
  id,
  title,
  tags,
  isnew,
  pagecount,
  index,
  onInfoClick,
  baseUrl,
  currentArchiveId,
  isSearch,
  wideImageDisplayMethod,
}) => {
  const [showFullTitle, updateShowFullTitle] = useState(false);
  const src = `http://${baseUrl}${THUMBNAIL_URL.replace(":id", id)}`;
  const [dimensions, { loading }] = useImageSize(src);
  const width = dimensions?.width ?? 0;
  const height = dimensions?.height ?? 0;
  const wideImage = width > height;
  const diffBetweenMaxHeightAndImageHeight = 300 - height;
  const isDiffBetweenMaxHeightAndImageHeightPositive =
    diffBetweenMaxHeightAndImageHeight > 0;
  const extraMargin = isDiffBetweenMaxHeightAndImageHeightPositive
    ? `${diffBetweenMaxHeightAndImageHeight * 0.5}px`
    : 0;
  const wideImageStyles = {
    ...styles.imageWide,
    ...(wideImageDisplayMethod && { objectFit: wideImageDisplayMethod }),
    ...(isDiffBetweenMaxHeightAndImageHeightPositive && {
      marginTop: extraMargin,
      marginBottom: extraMargin,
    }),
  };

  const ref = useRef();

  const onTitleClick = useCallback(() => {
    updateShowFullTitle(!showFullTitle);
  }, [showFullTitle]);

  useEffect(() => {
    if (id === currentArchiveId && !loading)
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [id, currentArchiveId, ref, loading]);


  const tagsAsObject = getTagsObjectFromTagsString(tags);
  var date_added = tagsAsObject?.date_added ?? '';
  date_added = DateTime.fromSeconds(Number(date_added)).toLocaleString()
  // TODO: 调整为可配置
  const language = tagsAsObject?.语言 ?? [];

  return (
    <Paper id={`archive_${id}`} style={styles.paper}>
      <div>
        <div style={styles.imageWrapper}>
          <Loading
            label="Loading thumbnail"
            loading={loading}
            height={styles.image.maxHeight}
          >
            <div style={{ position: 'relative' }}>
              <img
              id={`archive-img-${index}`}
              alt={`thumbnail for ${title}`}
              style={{
                ...styles.image,
                ...(wideImage ? wideImageStyles : styles.imageLong),
              }}
              src={src}
              height={height}
              width={width}
              loading="lazy"
              />
              {Boolean(isnew == 'true') ? <div style={{ position: 'absolute', zIndex: 2, left: '0px', top: '0px', backgroundColor: "blue" }}>NEW!</div> : <div></div>}
              <div style={{ position: 'absolute', zIndex: 2, right: '0px', bottom: '0px', backgroundColor: "black" }}>{pagecount}</div>
              <div style={{ position: 'absolute', zIndex: 2, left: '0px', bottom: '0px', backgroundColor: "black" }}>{date_added}</div>
              <div style={{ position: 'absolute', zIndex: 2, right: '0px', top: '0px', backgroundColor: "black" }}>{language[0]}</div>

            </div>
          </Loading>
        </div>
      </div>
      <div style={{ padding: "8px" }}>
        <button type="button" onClick={onTitleClick}>
          <a
            id={`archive-text-${index}`}
            style={{
              ...styles.typography,
              ...(!showFullTitle && styles.clamp),
              textDecoration: 'none',
              color: 'white',              
            }}
            ref={ref}
            href={`http://${baseUrl}/reader?id=${id}`}
            target="_blank"
          >
            {title}
          </a>
        </button>
      </div>
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
    </Paper>
  );
};

export default Archive;
