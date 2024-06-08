import React, { useState } from "react";
import "./Comments.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, editComment } from "../../actions/comments";
import moment from "moment";

const DisplayComments = ({
  cid,
  commentBody,
  userId,
  commentOn,
  userCommented,
}) => {
  const [commentBodyText, setCommentBodyText] = useState("");
  const [edit, setEdit] = useState(false);
  const [cmtId, setCmtId] = useState("");

  const currentUser = useSelector((state) => state?.currentUserReducer);

  const dispatch = useDispatch();

  const handleEdit = (cmtid, cmtbody) => {
    setEdit(true);
    setCmtId(cmtid);
    setCommentBodyText(cmtbody);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentBodyText) {
      alert("Please enter a comment");
    } else {
      dispatch(
        editComment({
          id: cmtId,
          commentBody: commentBodyText,
        })
      );
      setCommentBodyText("");
    }
    setEdit(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteComment(id));
  };

  return (
    <>
      {edit ? (
        <>
          <form className="comments_sub_form_comments" onSubmit={handleSubmit}>
            <input
              type="text"
              onChange={(e) => setCommentBodyText(e.target.value)}
              placeholder="Edit comment..."
              value={commentBodyText}
              className="comment_ibox"
            />
            <input
              type="submit"
              value="Change"
              className="comment_add_btn_comments"
            />
          </form>
        </>
      ) : (
        <>
          <p className="comment_body">{commentBody}</p>
        </>
      )}
      <p className="usercommented">
        - {userCommented} commented {moment(commentOn).fromNow()}
      </p>

      {currentUser?.result?._id === userId && (
        <p className="EditDel_DisplayComment">
          <i onClick={() => handleEdit(cid, commentBody)}>Edit</i>
          <i onClick={() => handleDelete(cid)}>Delete</i>
        </p>
      )}
    </>
  );
};

export default DisplayComments;
