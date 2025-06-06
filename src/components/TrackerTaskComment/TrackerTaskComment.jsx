import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useState } from "react";

import { urlForLocal } from "@utils/helper";

import { apiRequest } from "@api/request";

import { getCorrectDate } from "@components/Calendar/calendarHelper";
import TrackerTaskSubComment from "@components/TrackerTaskComment/TrackerTaskComment";

import del from "assets/icons/delete.svg";
import edit from "assets/icons/edit.svg";
import accept from "assets/images/accept.png";
import avatarMok from "assets/images/avatarMok.png";

export const TrackerTaskComment = ({
  taskId,
  comment,
  commentDelete,
  addSubComment,
  subCommentDelete,
}) => {
  const [commentsEditOpen, setCommentsEditOpen] = useState(false);
  const [commentsEditText, setCommentsEditText] = useState(comment.text);
  const [subCommentsCreateOpen, setSubCommentsCreateOpen] = useState(false);
  const [subCommentsCreateText, setSubCommentsCreateText] = useState("");

  function editComment() {
    if (commentsEditText === comment.text) return;
    apiRequest("/comment/update", {
      method: "PUT",
      data: {
        comment_id: comment.id,
        text: commentsEditText,
      },
    }).then(() => {});
  }

  function deleteComment() {
    apiRequest("/comment/update", {
      method: "PUT",
      data: {
        comment_id: comment.id,
        status: 0,
      },
    }).then(() => {
      if (comment.parent_id) {
        subCommentDelete(comment);
      } else {
        commentDelete(comment);
      }
    });
  }

  function createSubComment() {
    setSubCommentsCreateOpen(false);
    if (!subCommentsCreateText) return;

    apiRequest("/comment/create", {
      method: "POST",
      data: {
        text: subCommentsCreateText,
        entity_type: 2,
        entity_id: taskId,
        parent_id: comment.id,
      },
    }).then((res) => {
      let newSubComment = res;
      newSubComment.created_at = new Date();
      setSubCommentsCreateText("");
      addSubComment(comment.id, newSubComment);
    });

    let newSubComment = res;
    newSubComment.created_at = new Date();
    setSubCommentsCreateText("");
    addSubComment(comment.id, newSubComment);
  }

  return (
    <div
      className={[
        !comment.parent_id && comment.subComments.length
          ? "comments__list__item__main"
          : "",
        "comments__list__item",
        commentsEditOpen ? "comment__edit--open" : "",
        comment.parent_id ? "comments__list__item__subComment" : "",
      ].join(" ")}
    >
      <div className="comments__list__item__info">
        {/* Создатель комментария */}
        <div className="comments__list__item__fio">
          <img
            src={
              comment.user?.avatar
                ? urlForLocal(comment.user.avatar)
                : avatarMok
            }
            alt="avatar"
          />
          <p>{comment?.user?.userCard[0].fio}</p>
        </div>

        <div className="comments__list__item__date">
          {/* Комментарий создан, дата */}
          <span>{getCorrectDate(comment.created_at)}</span>

          {/* Редактирование своего комментария по клику */}
          {comment.userId === Number(localStorage.getItem("id")) && (
            <>
              <div className={commentsEditOpen ? "edit edit__open" : "edit"}>
                <img
                  src={edit}
                  alt="edit"
                  onClick={() => {
                    if (commentsEditOpen) {
                      editComment();
                    }
                    setCommentsEditOpen(!commentsEditOpen);
                  }}
                />
              </div>

              <img src={del} alt="delete" onClick={() => deleteComment()} />
            </>
          )}
        </div>
      </div>
      {commentsEditOpen ? (
        <CKEditor
          editor={ClassicEditor}
          data={commentsEditText}
          config={{
            removePlugins: [
              "CKFinderUploadAdapter",
              "CKFinder",
              "EasyImage",
              "Image",
              "ImageCaption",
              "ImageStyle",
              "ImageToolbar",
              "ImageUpload",
              "MediaEmbed",
              "BlockQuote",
            ],
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setCommentsEditText(data);
          }}
        />
      ) : (
        <p
          dangerouslySetInnerHTML={{ __html: commentsEditText }}
          className="comments__list__item__text"
        />
      )}

      {!comment.parent_id && !commentsEditOpen && (
        <>
          {subCommentsCreateOpen ? (
            <div className="comments__list__item__answer__new">
              <input
                value={subCommentsCreateText}
                onChange={(e) => {
                  setSubCommentsCreateText(e.target.value);
                }}
              />
              <img
                src={accept}
                alt="accept"
                onClick={() => {
                  createSubComment();
                }}
              />
            </div>
          ) : (
            <span
              onClick={() => {
                setSubCommentsCreateOpen(true);
              }}
              className="comments__list__item__answer"
            >
              Ответить
            </span>
          )}
        </>
      )}

      {/* вложенные комментарии */}
      {Boolean(comment.subComments?.length) &&
        comment.subComments.map((subComment) => {
          return (
            <TrackerTaskSubComment
              key={subComment.id}
              taskId={taskId}
              comment={subComment}
              subCommentDelete={subCommentDelete}
            />
          );
        })}
    </div>
  );
};

export default TrackerTaskComment;
