import { Rating, TextField, Button, Grid } from "@mui/material";
import React, { useState } from "react";
import { getArchiveMetaData, updateArchiveMetaData } from "../../../requests/metadata";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllSectionVisibilityFalse,
  updateSearchArchives,
  updateSearchFilter,
  updateSearchPage,
  updateSectionVisibility,
} from "../../../app/slice";
import { getArchivesBySearch } from "../../../requests/search";
import {
  getSearchCategory,
  getSearchSort,
  getSearchSortDirection,
} from "../../../app/selectors";
import { setSearchStats } from "../../../storage/search";
import { addSearchToSearchHistory } from "../../../storage/history";

export const ArchiveMetadataButtons = ({
  id,
  tagsAsObject,
}) => {
  // Process tags
  const oldRating = tagsAsObject?.Rating ?? 0;
  const oldComment = tagsAsObject?.Comment ?? "";
  const doujinshiUrl = tagsAsObject?.source ?? ["#"];
  // TODO: 调整为可配置
  var tagsToShowType = '女性'
  const tagsToShow = tagsAsObject?.[tagsToShowType] ?? [];
  var artistTagType = '艺术家'
  const artist = tagsAsObject?.[artistTagType] ?? [];


  // add rating tag
  const [currentRating, setCurrentRating] = useState(parseFloat(oldRating));
  // add comment tag
  const [currentComment, setCurrentComment] = useState(oldComment);

  const onRatingClick = async (rating) => {
    try {
      const metaData = await getArchiveMetaData(id);
      const oldTags = metaData?.tags ?? "";
      // remove rating tag and add new one
      var newTags = oldTags.replace(/Rating:\d+(\.\d+)?/g, "").replace(/^(, *)+|(, *)+$/g, "");
      if (rating != null) {
        rating = parseFloat(rating)
        newTags = newTags + ", Rating:" + rating;
      }
      updateArchiveMetaData(id, null, newTags.trim(), null);
      setCurrentRating(rating);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };
  const onCommentClick = async (event) => {
    try {
      const metaData = await getArchiveMetaData(id);
      const oldTags = metaData?.tags ?? "";
      const comment = event.target.value;
      // remove comment tag and add new one
      var newTags = oldTags.replace(new RegExp("Comment:" + currentComment), '').replace(/^(, *)+|(, *)+$/g, "");
      if (comment != null && comment != '') {
        newTags = newTags + ", Comment:" + comment;
      }
      updateArchiveMetaData(id, null, newTags.trim(), null);
      setCurrentComment(comment);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };


  const dispatch = useDispatch();
  const searchCategory = useSelector(getSearchCategory);
  const sort = useSelector(getSearchSort);
  const sortDirection = useSelector(getSearchSortDirection);

  const callNewArchives = async (searchVal) => {
    const arcs = await getArchivesBySearch({
      filter: searchVal,
      sortby: sort,
      order: sortDirection,
      start: -1,
      ...(searchCategory?.id && { category: searchCategory?.id }),
    });
    dispatch(updateSearchArchives(arcs.data));
  };
  const onTagClick = (tagType, tag) => {
    const filter = tagType !== "other" ? `${tagType}:${tag}` : tag;
    callNewArchives(filter);
    dispatch(updateSearchFilter(filter));
    dispatch(updateSearchPage(1));
    dispatch(setAllSectionVisibilityFalse());
    dispatch(updateSectionVisibility({ search: true }));

    const searchStatsObject = {
      filter,
      page: 1,
      sort,
      direction: sortDirection,
      category: searchCategory?.id ?? "",
    };
    setSearchStats(searchStatsObject);
    addSearchToSearchHistory(searchStatsObject);
  };

  const [expanded, setExpanded] = useState(false);
  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };


  return (
    <div>

      {/* TODO: 调整样式 */}
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {tagsToShow.slice(0, expanded ? tagsToShow.length : 5).map((tag, index) => (
          <Grid
            key={`${tag}`}
            item
            xs={2} sm={4} md={4}
            style={{ minWidth: '64px', maxWidth: '100%' }}
          >
            <Button
              variant="outlined"
              size="small"
              sx={{ textTransform: "none", padding: 0 }}
              onClick={() => onTagClick(tagsToShowType, tag)}
            >
              {tag}
            </Button>
          </Grid>
        ))}
        {tagsToShow.length > 5 && (
          <Grid item xs={2} sm={4} md={4} style={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none', padding: 0 }}
              onClick={handleToggleExpanded}
            >
              {expanded ? '-' : '+'}
            </Button>
          </Grid>
        )}
      </Grid>


      <Grid container paddingTop={1}>
        <Grid item xs={7}>
          <Button
            variant="contained"
            size="medium"
            fullWidth
            sx={{ textTransform: "none", padding: 0 }}
            onClick={() => onTagClick(artistTagType, artist[0])}
          >
            {artist[0]}
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            sx={{ textTransform: "none", padding: 0 }}
            target="_blank"
            href={"https://" + doujinshiUrl[0]}
          >
            SOURCE
          </Button>
        </Grid>
      </Grid>

      <Grid item xs={8}>
        <Rating
          precision={0.5}
          value={currentRating}
          onChange={(event, value) => onRatingClick(value)}
        />
      </Grid>

      <TextField
        defaultValue={currentComment}
        multiline
        onBlur={onCommentClick}
      />
    </div>
  );
};
