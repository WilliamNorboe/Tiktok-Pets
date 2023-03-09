// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});


// async function sendGetRequest(url) {
//   params = {
//     method: 'GET', 
//      };
  
//   let response = await fetch(url,params);
//   if (response.ok) {
//     let data = await response.json();
//     return data;
//   } else {
//     throw Error(response.status);
//   }
// }



// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

showWinningVideo()

function showWinningVideo() {
	
  sendGetRequest("/getWinner")
	.then(function(result){
		// let winningUrl = "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166";
		console.log(result);
		let winningUrl = result.url;
		
		console.log(result.nickname);
		
		document.getElementById('nic3').textContent = result.nickname;
  	addVideo(winningUrl, divElmt);
  	loadTheVideos();
		
	})
	.catch(function (error){
		console.log("Error:", error);
	});
  
}
