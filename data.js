import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.delet) {
    handleDeletClick(e.target.dataset.delet);
  }
});

// ======================== Handle Like Click ====================== //
function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

// ======================== Handle Retweet Click ====================== //

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

// ======================== Handle Reply Click ====================== //

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

// ======================== Handle Tweet ====================== //

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba ✅`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }
}

// ======================== Delete Tweet ====================== //

function handleDeletClick(tweetId) {
  console.log("to delete");
  const deleteObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];
  tweetsData.splice(tweetsData.indexOf(deleteObj), 1);

  render();
}

// ================ Handle tweet reply ========================== //

document.addEventListener("change", function (e) {
  if (e.target.dataset.thread) {
    handleThreadChange(e.target.dataset.thread);
  }
});

function handleThreadChange(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];
  const threadText = document.getElementById(`thread-${tweetId}`);
  targetTweetObj.replies.push({
    handle: `@Scrimba ✅`,
    profilePic: `images/scrimbalogo.png`,
    tweetText: threadText.value,
  });

  const sendBtn = document.getElementById(`send-btn-${tweetId}`);
  sendBtn.addEventListener("click", function () {
    threadText.value = "";
    render();
  });
}

// ======================== Handle Feed  ====================== //

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
    <div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
    </div>
  
`;
      });
    }

    feedHtml += `
<div class="tweet">
    <button class="delete-btn" data-delet="${tweet.uuid}" id="delete-btn">X</button>
    <div class="tweet-inner">
        <div class="tweet-profile">
        <img src="${tweet.profilePic}" class="profile-pic">
        </div>
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
           
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
             
        </div>            
    </div>
    </div> 
     
    <div class="hidden" id="replies-${tweet.uuid}">    
        ${repliesHtml}
       
</div>
     <div class="thread-area">
        <img src="images/scrimbalogo.png" class="profile-pic " />
        <textarea placeholder="Jot something down" class="thread" data-thread="${tweet.uuid}" id="thread-${tweet.uuid}"/></textarea>  
    </div> 
     <button class="thread-btn" id="send-btn-${tweet.uuid}" >Send</button>
`;
  });
  return feedHtml;
}

// ======================== Render it to innerHTML  ====================== //

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();

// ======================== Local Storage  ====================== //

localStorage.setItem("tweets", JSON.stringify(tweetsData));

let tweets = JSON.parse(localStorage.getItem("tweets"));
