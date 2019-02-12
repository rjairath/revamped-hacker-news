const state = {};
const baseUrl = "https://hacker-news.firebaseio.com/v0";

function fetchTopStories(){
	const topStoriesUrl = `${hnBaseUrl}/topstories.json`;
	return fetch(topStoriesUrl).then(response=> response.json())
		.then()
}
function fetchStories(){

}

function renderStories(){

}

function toggleStoryText(){

}
function fetchComments(){

}
function fetchOrToggleComments(){

}
function ToggleComment(){

}

function renderComments(){

}
fetchTopStories();