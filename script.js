import {
  countId,
  deleteComment,
  editComment,
  formatDateTime,
} from "./functions/functions.js";
import { CreateElement } from "./functions/dom.js";
import { data } from "./functions/data.js";

const textarea = document.querySelector(".textarea");
const sendButton = document.querySelector(".btn_send");
const comment_section = document.querySelector(".comment_section");

function InitializeComment(comment) {
  const element = CreateElement("div", {
    class: "comment__card",
    "data-id": `${comment.id}`,
  });

  element.innerHTML = `
  <div class="card__user_info">
    <img src="./images/avatars/image-amyrobson.png" alt="" class="userimage">
    <p class="username">Lorem, ipsum dolor.</p>
    <p class="createdAt">1 month ago</p>
  </div>
  <div class="card__score">
    <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg" class="btn_plus">
      <path
        d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
        fill="#C5C6EF" />
    </svg>
    <p class="score">5</p>
    <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg" class="btn_minus">
      <path
        d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
        fill="#C5C6EF" />
    </svg>
  </div>
  <div class="box_btn">
    <button class="action reply">Reply</button>
  </div>
  <div class="card__comment">
    <span class="replyingTo"></span>
    <p class="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi aliquam numquam ipsam
      delectus quis vitae!</p>
  </div>`;
  const userimage = element.querySelector(".userimage");
  userimage.setAttribute("src", comment.user.image.png);

  const username = element.querySelector(".username");
  username.innerText = comment.user.username;

  if (comment.user.username === data.currentUser.username) {
    const you = CreateElement("span", {
      class: "you",
    });
    you.textContent = "you";

    const delete_btn = CreateElement("div", {
      class: "action delete",
    });
    delete_btn.textContent = "Delete";
    //DELETE USER COMMENT
    delete_btn.addEventListener("click", (e) => {
      const parentElem = e.currentTarget.parentElement.parentElement;
      const commentContainer = parentElem.querySelector(".card__comment");
      const comment_id = commentContainer.parentElement.dataset.id;

      data.comments = deleteComment(data.comments, parseInt(comment_id));
      console.log(data.comments);

      const elem = e.currentTarget.parentElement.parentElement;
      elem.remove();
    });

    const edit_btn = CreateElement("div", {
      class: "action edit",
    });
    edit_btn.textContent = "Edit";
    //EDIT USER COMMENT
    edit_btn.addEventListener("click", (e) => {
      const parentElem = e.currentTarget.parentElement.parentElement;
      const commentContainer = parentElem.querySelector(".card__comment");
      const comment_id = commentContainer.parentElement.dataset.id;

      const username = commentContainer.querySelector("span").innerText;

      const update_container = CreateElement("div", {
        class: "update_container",
      });
      update_container.style.gridArea = "card__comment";

      const t_area = CreateElement("textarea", {
        class: "textarea",
        rows: "3",
      });

      t_area.value =
        username + " " + commentContainer.querySelector("p").innerText;

      const update_btn = CreateElement("button", {
        class: "btn update",
      });

      update_btn.onclick = () => {
        const newContent = t_area.value.replace(username, "");
        commentContainer.querySelector("p").innerText = newContent;
        debugger;
        editComment(data.comments, parseInt(comment_id), newContent);
        parentElem.replaceChild(commentContainer, update_container);

        console.log(data.comments);
      };

      update_btn.textContent = "UPDATE";
      update_container.append(t_area);
      update_container.append(update_btn);

      parentElem.replaceChild(update_container, commentContainer);
    });

    username.insertAdjacentElement("afterend", you);
    element.querySelector(".box_btn").append(delete_btn);
    element.querySelector(".box_btn").append(edit_btn);

    element.querySelector(".box_btn .reply").style.display = "none";
  }

  const createdAt = element.querySelector(".createdAt");
  createdAt.innerText = comment.createdAt;

  const score = element.querySelector(".score");
  score.innerText = comment.score;

  //LES EVENEMENTS:
  //INCREMENT SCORE
  element.querySelector(".btn_plus").addEventListener("click", (e) => {
    score.innerText = comment.score++;
  });

  //DECREMENT SCORE
  element.querySelector(".btn_minus").addEventListener("click", (e) => {
    if (comment.score >= 0) {
      score.innerText = comment.score--;
    }
  });

  //REPLY
  element.querySelector(".reply").addEventListener("click", (e) => {
    const replyByUser = document.querySelector(".add_comment").cloneNode(true);
    replyByUser.classList.add("reply");
    const parentElem = e.currentTarget.parentElement.parentElement;
    const comment_id = parentElem.dataset.id;
    const username = parentElem.querySelector(".username");

    parentElem.insertAdjacentElement("afterend", replyByUser);

    replyByUser.querySelector(".btn_send").addEventListener("click", (e) => {
      e.preventDefault();

      const content = replyByUser.querySelector("textarea").value;
      // console.log(content);
      const numLastId = countId(data.comments);
      
      const reply = {
        id: numLastId + 1,
        content: content,
        createdAt: formatDateTime(new Date()),
        score: 0,
        replyingTo: username.innerText,
        user: {
          image: {
            png: data.currentUser.image.png,
            webp: data.currentUser.image.webp,
          },
          username: data.currentUser.username,
        },
        replies: [],
      };

      for (let comment of data.comments) {
        if (comment.id === parseInt(comment_id)) {
          comment.replies.push(reply);
        }

        if (comment.replies.length > 0) {
          for (let c of comment.replies) {
            if (c.id === parseInt(comment_id)) {
              c.replies = [];
              c.replies.push(reply);
            }
          }
        }
      }

      console.log(data.comments);

      const elem = InitializeComment(reply);

      const t = document.querySelectorAll(".replies__contain");
      for (let i of t) {
        if (i.getAttribute("id") === `replyngTo-comment-${comment.id}`) {
          i.append(elem);
        } else {
          const replies__contain = CreateElement("div", {
            class: "replies__contain",
            id: `replyngTo-comment-${comment.id}`,
          });
          replies__contain.append(elem);
          parentElem.insertAdjacentElement("afterend", replies__contain);
        }
      }

      replyByUser.remove();
    });
  });

  const cardComment = element.querySelector(".content");
  cardComment.innerText = comment.content;

  if (comment.replyingTo) {
    const replyingTo = element.querySelector(".replyingTo");
    replyingTo.innerText = `@${comment.replyingTo}`;
  }

  return element;
}

for (let comment of data.comments) {
  const element = InitializeComment(comment);
  comment_section.append(element);
  if (comment.replies.length > 0) {
    const replies__contain = CreateElement("div", {
      class: "replies__contain",
      id: `replyngTo-comment-${comment.id}`,
    });

    for (let replies of comment.replies) {
      const elem = InitializeComment(replies);

      replies__contain.append(elem);
    }
    element.insertAdjacentElement("afterend", replies__contain);
  }
}

function add() {
  const numLastId = countId(data.comments);
  const comment = {
    id: numLastId + 1,
    content: textarea.value,
    createdAt: formatDateTime(new Date()),
    score: 0,
    user: {
      image: {
        png: data.currentUser.image.png,
        webp: data.currentUser.image.webp,
      },
      username: data.currentUser.username,
    },
    replies: [],
  };

  data.comments.push(comment);

  // console.log(data);

  comment_section.append(InitializeComment(comment));

  textarea.value = "";
}

sendButton.addEventListener("click", (e) => {
  e.preventDefault();

  add();
});

textarea.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    add();
  }
});
