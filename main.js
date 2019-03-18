const state = {};
const baseUrl = "https://hacker-news.firebaseio.com/v0";

function fetchTopStories(){
	const topStoriesUrl = `${baseUrl}/topstories.json`;
	return fetch(topStoriesUrl).then(response => response.json())
	.then((data) => {fetchStories(data)});
}
function fetchStories(data){
	let topStories = data.slice(0, 30);
	let storyDetails = topStories.map((storyId)=>{
		const storyUrl = `${baseUrl}/item/${storyId}.json`;
		return fetch(storyUrl).then((response)=> response.json());
	});
	return Promise.all(storyDetails).then((stories)=>{
		state.stories = stories;
		renderStories(stories);
	});
}
//Array of top 30 stories in json format as the parameter to this function.
function renderStories(stories){
	let index = 1;
	return stories.map((story)=>{
		const userUrl = `https://news.ycombinator.com/user?id=${story.by}`;
		const storyItemUrl = `https://news.ycombinator.com/item?id=${story.id}`;

		const html = `
		<div class='story' id='${story.id}'>
		<div class="titleDiv">
		<h3 class="index">${index}.</h3>
		<h3 class='title'>
		${story.url ? `<a href="#" onclick="openModal('${story.url}')">${story.title}</a>`
		: `<a href='javascript:void(0)' onclick="toggleStoryText('${story.id}')" >${story.title}</a>`}
		</h3>
		</div>
		<div class="scoreComments">
		<span class='score'> ${story.score} </span> points by
		<a href='${userUrl}' target='_blank' class='story-by'> ${story.by}</a>

		<div class='toggle-view'>
		${story.kids ? `
			<span
			onclick="fetchOrToggleComments('${story.kids}','${story.id}')"
			class='comments'
			> | ${story.descendants} comments </span>`
			: '' }
			</div>
			</div>

			${story.text ?
				`<div class='storyText' id='storyText-${story.id}' style='display:none;'>
				${story.text} </div>` : '' }

				<div id='comments-${story.id}' style='display: block;'></div>
				</div> `
				document.getElementById('hn').insertAdjacentHTML('beforeend', html);
				index++;
			})
}
//Toggles the story text if there is no story url.
function toggleStoryText(){
	const storyText = document.getElementById(`storyText-${story.id}`);
	storyText.style.display = (storyText.style.display === "block")? "none": "block";
}
function fetchComments(kids, storyId){
	const commentIds = kids.split(',')
	const allComments = commentIds.map((commentId) => {
		const commentUrl = `${baseUrl}/item/${commentId}.json`
		return fetch(commentUrl).then((response) => response.json());
	});
	return Promise.all(allComments).then((comments) => {
		state[storyId] = comments;
		renderComments(comments, storyId);
	})
}
function fetchOrToggleComments(kids, storyId){
	function toggleAllComments(storyId) {
		const allComments = document.getElementById(`comments-${storyId}`);
		allComments.style.display = (allComments.style.display === 'block') ? 'none' : 'block';
	}
	state[storyId] ? toggleAllComments(storyId) : fetchComments(kids, storyId)
}
function toggleComment(commentId){
	const comment = document.getElementById(commentId)
	const toggle = document.getElementById(`toggle-${commentId}`)
	comment.style.display = (comment.style.display === 'block') ? 'none' : 'block'
	toggle.innerHTML = (toggle.innerHTML === '[ - ]') ? '[ + ]' : '[ - ]'
}
//Call this function after all comments for a story ID have been fetched.
function renderComments(comments, storyId){
	return comments.map((comment) => {
		const userUrl = `https://news.ycombinator.com/user?id=${comment.by}`;
		const html = comment.deleted || comment.dead ? '' : `
		<div class='comment'>
		<span onclick='toggleComment("${comment.id}")'
		href='javascript:void(0)'
		id='toggle-${comment.id}'
		class='toggle-comment'>[ - ]</span>
		<a href='${userUrl}' class='comment-by' target="_blank"> ${comment.by}</a>	
		<div id=${comment.id} class='comment-text' style='display:block;'>
		${comment.text}
		</div>
		</div> 
		`
		comment.parent == 
		storyId ?
		document.getElementById(`comments-${storyId}`).insertAdjacentHTML('beforeend', html):
		document.getElementById(comment.parent).insertAdjacentHTML('beforeend', html);
		if (comment.kids) 
			return fetchComments(comment.kids.toString(), storyId);
	})
}
fetchTopStories();

function toggleDarkLight(){
	var body = document.getElementById("body");
	var currentClass = body.className;

	body.className = (currentClass === "dark-mode"? "light-mode" : "dark-mode");
}
//Open the link in new tab if max-width: 500px.
function openModal(url){
	// console.log(url);
	if(window.screen.width<=500){
		var win = window.open(url, '_blank');
		win.focus();
		return;
	}
	var modal = document.querySelector(".modal");
	var iframe = document.querySelector("iframe");
	var openLinkTag = document.querySelector("#openLinkTag");

	modal.classList.add("show-modal");
	iframe.setAttribute("src", url);
	openLinkTag.setAttribute("href", url);
}
function closeModal(){
	var modal = document.querySelector(".modal");
	var iframe = document.querySelector("iframe");

	modal.classList.remove("show-modal");
	iframe.setAttribute("src", "about:blank");
}
