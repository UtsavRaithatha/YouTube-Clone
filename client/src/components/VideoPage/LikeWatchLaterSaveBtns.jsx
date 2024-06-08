import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import "./LikeWatchLaterSaveBtns.css";
import { MdPlaylistAddCheck } from "react-icons/md";
import {
  RiHeartAddFill,
  RiPlayListAddFill,
  RiShareForwardLine,
} from "react-icons/ri";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { likeVideo } from "../../actions/video";
import { addToLikedVideos, deleteLikedVideo } from "../../actions/likedVideo";
import { addToWatchLater, deleteWatchLater } from "../../actions/watchLater";

const LikeWatchLaterSaveBtns = ({ vv, vid }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.currentUserReducer);

  const [saveVideo, setSaveVideo] = useState(false);
  const [dislikeBtn, setDislikeBtn] = useState(false);
  const [likeBtn, setLikeBtn] = useState(false);
  const likedVideosList = useSelector((state) => state.likedVideoReducer);
  const watchLaterList = useSelector((state) => state.watchLaterReducer);

  useEffect(() => {
    // likedVideosList?.data
    //   ?.filter(
    //     (q) => q?.videoId === vid && q?.viewer === currentUser?.result._id
    //   )
    //   .map((m) => setLikeBtn(true));

    // watchLaterList?.data
    //   ?.filter(
    //     (q) => q?.videoId === vid && q?.viewer === currentUser?.result._id
    //   )
    //   .map((m) => setSaveVideo(true));
    if (Array.isArray(likedVideosList?.data)) {
      likedVideosList.data
        .filter(
          (q) => q?.videoId === vid && q?.viewer === currentUser?.result._id
        )
        .map((m) => setLikeBtn(true));
    }

    if (Array.isArray(watchLaterList?.data)) {
      watchLaterList.data
        .filter(
          (q) => q?.videoId === vid && q?.viewer === currentUser?.result._id
        )
        .map((m) => setSaveVideo(true));
    }
  }, [likedVideosList, watchLaterList, currentUser, vid]);

  const toggleSavedVideo = () => {
    if (currentUser) {
      if (saveVideo) {
        setSaveVideo(false);
        dispatch(
          deleteWatchLater({
            videoId: vid,
            viewer: currentUser?.result?._id,
          })
        );
      } else {
        setSaveVideo(true);
        dispatch(
          addToWatchLater({
            videoId: vid,
            viewer: currentUser?.result?._id,
          })
        );
      }
    } else {
      alert("Please login to save the video");
    }
  };

  const toggleLikeBtn = (e, lk) => {
    if (currentUser) {
      if (likeBtn) {
        setLikeBtn(false);
        dispatch(
          likeVideo({
            id: vid,
            like: lk - 1,
          })
        );
        dispatch(
          deleteLikedVideo({
            videoId: vid,
            viewer: currentUser?.result?._id,
          })
        );
      } else {
        setLikeBtn(true);
        setDislikeBtn(false);
        dispatch(
          likeVideo({
            id: vid,
            like: lk + 1,
          })
        );
        dispatch(
          addToLikedVideos({
            videoId: vid,
            viewer: currentUser?.result?._id,
          })
        );
      }
    } else {
      alert("Please login to like the video");
    }
  };

  const toggleDislikeBtn = (e, lk) => {
    if (currentUser) {
      if (dislikeBtn) {
        setDislikeBtn(false);
      } else {
        setDislikeBtn(true);
        setLikeBtn(false);
        if (likeBtn) {
          dispatch(
            likeVideo({
              id: vid,
              like: lk - 1,
            })
          );
          dispatch(
            deleteLikedVideo({
              videoId: vid,
              viewer: currentUser?.result?._id,
            })
          );
        }
      }
    } else {
      alert("Please login to dislike the video");
    }
  };

  return (
    <div className="btns_cont_videoPage">
      <div className="btn_VideoPage">
        <BsThreeDots />
      </div>
      <div className="btn_VideoPage">
        <div
          className="like_videoPage"
          onClick={(e) => toggleLikeBtn(e, vv.like)}
        >
          {likeBtn ? (
            <>
              <AiFillLike size={22} className="btns_videoPage" />
            </>
          ) : (
            <>
              <AiOutlineLike size={22} className="btns_videoPage" />
            </>
          )}
          <b>{vv?.like}</b>
        </div>
        <div
          className="like_videoPage"
          onClick={(e) => toggleDislikeBtn(e, vv.like)}
        >
          {dislikeBtn ? (
            <>
              <AiFillDislike size={22} className="btns_videoPage" />
            </>
          ) : (
            <>
              <AiOutlineDislike size={22} className="btns_videoPage" />
            </>
          )}
          <b>Dislike</b>
        </div>
        <div className="like_videoPage">
          <>
            <RiHeartAddFill size={22} className="btns_videoPage" />
            <b>Thanks</b>
          </>
        </div>
        <div className="like_videoPage">
          <>
            <RiShareForwardLine size={22} className="btns_videoPage" />
            <b>Share</b>
          </>
        </div>
        <div className="like_videoPage" onClick={() => toggleSavedVideo()}>
          {saveVideo ? (
            <>
              <MdPlaylistAddCheck size={22} className="btns_videoPage" />
              <b>Saved</b>
            </>
          ) : (
            <>
              <RiPlayListAddFill size={22} className="btns_videoPage" />
              <b>Save</b>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikeWatchLaterSaveBtns;
