import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.tweet || e.target.dataset.tweetText || e.target.dataset.tweetDetails){
        const tweetId = e.target.dataset.tweet || e.target.dataset.tweetText || e.target.dataset.tweetDetails;
        handleTweetClick(tweetId);
    }
    
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render(tweetId)
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render(tweetId)
}

function handleReplyClick(replyId){
    document.getElementById(`reply-input-area-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleTweetClick(tweetId){
    const tweetModal = document.getElementById('tweet-modal');
    const tweetModalContent = document.getElementById('tweet-modal-content');

    tweetModal.style.display = 'block';
    tweetModalContent.innerHTML = modalTweet(tweetId);

    tweetModal.addEventListener('click', function(e){
        if (e.target === this){
            tweetModal.style.display = 'none';
        }
    });
    
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                            <div class="tweet-reply">
                                <div class="tweet-inner">
                                    <img src="${reply.profilePic}" class="profile-pic">
                                        <div>
                                            <p class="handle">${reply.handle}</p>
                                            <p class="tweet-text">${reply.tweetText}</p>
                                        </div>
                                    </div>
                            </div>
                            `
            })
        }
        
          
        feedHtml += `
                    <div class="tweet" >
                        <div class="tweet-inner" data-tweet="${tweet.uuid}">
                            <img src="${tweet.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${tweet.handle}</p>
                                <p class="tweet-text" data-tweet-text="${tweet.uuid}">${tweet.tweetText}</p>
                                <div class="tweet-details" data-tweet-details="${tweet.uuid}">
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
                        <div class="hidden" id="replies-${tweet.uuid}">
                            ${repliesHtml}
                        </div>   
                        <div id="reply-input-area-${tweet.uuid}" class="hidden">
                            <img src="images/scrimbalogo.png" class="profile-pic">
                            <textarea id="reply-input">${tweet.handle} </textarea>
                            <button id="reply-btn">Reply</button>
                        </div>
                    </div>
                    `
   })
   return feedHtml 
}

function modalTweet(tweetId){
    let tweetHtml = '';

    tweetsData.forEach(function(tweet){

        if(tweet.uuid === tweetId){
            let likeIconClass = ''
        
            if (tweet.isLiked){
                likeIconClass = 'liked'
            }
            
            let retweetIconClass = ''
            
            if (tweet.isRetweeted){
                retweetIconClass = 'retweeted'
            }

            for(let i=0; i<tweetsData.length; i++){
                if (tweetId === tweetsData[i].uuid){
                    tweet = tweetsData[i];
                }
            }

            let repliesHtml = ''
            
            if(tweet.replies.length > 0){
                tweet.replies.forEach(function(reply){
                    repliesHtml+=`
                                <div class="tweet-reply">
                                    <div class="tweet-inner">
                                        <img src="${reply.profilePic}" class="profile-pic">
                                            <div>
                                                <p class="handle">${reply.handle}</p>
                                                <p class="tweet-text">${reply.tweetText}</p>
                                            </div>
                                        </div>
                                </div>
                                `
                })
            }
            
            tweetHtml = `
                                            <div class="tweet" >
                                                <div class="tweet-inner" data-tweet="${tweet.uuid}">
                                                    <img src="${tweet.profilePic}" class="profile-pic">
                                                    <div>
                                                        <p class="handle">${tweet.handle}</p>
                                                        <p class="tweet-text" data-tweet-text="${tweet.uuid}">${tweet.tweetText}</p>
                                                        <div class="tweet-details" data-tweet-details="${tweet.uuid}">
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
                                                <div id="reply-input-area-${tweet.uuid}">
                                                    <img src="images/scrimbalogo.png" class="profile-pic">
                                                    <textarea id="reply-input">${tweet.handle} </textarea>
                                                    <button id="reply-btn">Reply</button>
                                                </div>
                                                <div id="replies-${tweet.uuid}">
                                                    ${repliesHtml}
                                                </div>
                                            </div>
                                            `
        }

    })
    
    return tweetHtml;
}

function render(tweetId){
    document.getElementById('feed').innerHTML = getFeedHtml()
    document.getElementById('tweet-modal-content').innerHTML = modalTweet(tweetId);
}

render()

