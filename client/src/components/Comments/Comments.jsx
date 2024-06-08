import React, { useState } from "react";
import "./Comments.css";
import DisplayComments from "./DisplayComments";
import { useDispatch, useSelector } from "react-redux";
import { postComment } from "../../actions/comments";

const Comments = ({ videoId }) => {
  const [commentText, setCommentText] = useState("");

  const currentUser = useSelector((state) => state?.currentUserReducer);
  const commentsList = useSelector((state) => state?.commentReducer);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentUser) {
      if (!commentText) {
        alert("Please enter a comment");
      } else {
        dispatch(
          postComment({
            videoId: videoId,
            userId: currentUser?.result?._id,
            commentBody: commentText,
            userCommented: currentUser?.result?.name,
          })
        );
        setCommentText("");
      }
    } else {
      alert("Please login to comment");
    }
  };

  return (
    <>
      <form className="comments_sub_form_comments" onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          value={commentText}
          className="comment_ibox"
        />
        <input type="submit" value="Add" className="comment_add_btn_comments" />
      </form>
      <div className="display_comment_container">
        {commentsList?.data
          ?.filter((q) => videoId === q?.videoId)
          .reverse()
          .map((m) => {
            return (
              <DisplayComments
                cid={m._id}
                userId={m.userId}
                commentBody={m.commentBody}
                commentOn={m.commentOn}
                userCommented={m.userCommented}
              />
            );
          })}
      </div>
    </>
  );
};

export default Comments;
