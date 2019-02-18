const state = {};
const baseUrl = "https://hacker-news.firebaseio.com/v0";

function fetchTopStories(){
	const topStoriesUrl = `${baseUrl}/topstories.json`;
	return fetch(topStoriesUrl).then(response => response.json())
		.then((data) => {fetchStories(data)});
}
function fetchStories(data){
	let topStories = data.slice(0, 30);
	let storyIds = topStories.map((storyId)=>{
		const storyUrl = `${baseUrl}/item/${storyId}.json`;
		return fetch(storyUrl).then((response)=> response.json());
	});
	return Promise.all(storyIds).then((stories)=>{
		state.stories = stories;
		renderStories(stories);
	});
}
//Array of top 30 stories in json format as the parameter to this function.
function renderStories(stories){
	return stories.map((story)=>{
		const userUrl = `https://news.ycombinator.com/user?id=${story.by}`;
	    const storyItemUrl = `https://news.ycombinator.com/item?id=${story.id}`;
	    const html = `
	      <div class='story' id='${story.id}'>
	        <h3 class='title'>
	          ${story.url ? `<a href='${story.url}' target='_blank'>${story.title}</a>`
	            : `<a href='javascript:void(0)' onclick="toggleStoryText('${story.id}')" >${story.title}</a>`}
	        </h3>
	        <span class='score'> ${story.score} </span> points by
	        <a href='${userUrl}' target='_blank' class='story-by'> ${story.by}</a>
	        <div class='toggle-view'>
	          ${story.kids ? `
	            <span
	              onclick="fetchOrToggleComments('${story.kids}','${story.id}')"
	              class='comments'
	            > [toggle ${story.descendants} comments] </span>`
	          : '' }
	          <a href='${storyItemUrl}' target='_blank' class='hnLink'>[view on HN]</a>
	        </div>
	        ${story.text ?
	          `<div class='storyText' id='storyText-${story.id}' style='display:none;'>
	            ${story.text} </div>` : '' }
	        <div id='comments-${story.id}' style='display: block;'></div>
	      </div> `
    	document.getElementById('hn').insertAdjacentHTML('beforeend', html);
	})
}

function toggleStoryText(){
	const storyText = document.getElementById(`storyText-${story.id}`);
	storyText.style.display = (storyText.style.display === "block")? "none": "block";
}
function fetchComments(kids, storyId){
	const commentIds = kids.split(',')
	const allComments = commentIds.map((commentId) => {
		const commentUrl = `${baseUrl}/item/${commentId}.json`
		return fetch(commentUrl).then((response) => response.json()).then((comment) => comment)
	})
	return Promise.all(allComments).then((comments) => {
		state[storyId] = comments;
		renderComments(comments, storyId);
	})
}
function fetchOrToggleComments(){

}
function ToggleComment(){

}

function renderComments(){

}
fetchTopStories();