let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");

let nextButton = document.getElementById("next");
nextButton.addEventListener("click", nextClicked);

for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
} // for loop


// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.
// const urls = ["https://www.tiktok.com/@berdievgabinii/video/7040757252332047662",
// "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166"];

// for (let i=0; i<2; i++) {
//       addVideo(urls[i],videoElmts[i]);
//     }
//     // load the videos after the names are pasted in! 
//     loadTheVideos();


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

// async function sendPostRequest(url,data) {
//   params = {
//     method: 'POST', 
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(data) };
//   console.log("about to send post request");
  
//   let response = await fetch(url,params);
//   if (response.ok) {
//     let data = await response.text();
//     return data;
//   } else {
//     throw Error(response.status);
//   }
// }


sendGetRequest("/getTwoVideos")
	.then(function(result){
		console.log(result);
		for (let i=0; i<2; i++) {
      addVideo(result[i].url,videoElmts[i]);
			document.getElementById("heart" + (i+1)).value = result[i].rowIdNum;
			document.getElementById("nic" + (i+1)).textContent = result[i].nickname;
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
	})
	.catch(function(err) {
        console.log("GET request error", err);
  });


let heart1 = document.getElementById("heart1");
let heart2 = document.getElementById("heart2");

heart1.addEventListener("click",heart1Func);
heart2.addEventListener("click",heart2Func);

function heart1Func(){
	console.log("Heart1psuhed");
	document.getElementById("far1").style.display = "none";
	document.getElementById("fas1").style.display = "flex";
	document.getElementById("heart1").style.color = "#EE1D52";

	document.getElementById("far2").style.display = "inline";
	document.getElementById("fas2").style.display = "none";
	document.getElementById("heart2").style.color = "rgb(180,180,180)";
}

function heart2Func(){
	console.log("Heart2psuhed")

	document.getElementById("far2").style.display = "none";
	document.getElementById("fas2").style.display = "inline";
	document.getElementById("heart2").style.color = "#EE1D52";

	document.getElementById("far1").style.display = "inline";
	document.getElementById("fas1").style.display = "none";
	document.getElementById("heart1").style.color = "rgb(180,180,180)";
}



function nextClicked(){
	console.log("next Button Clicked");
// 	let temp = '{ "employees" : [' +
// '{ "firstName":"John" , "lastName":"Doe" },' +
// '{ "firstName":"Anna" , "lastName":"Smith" },' +
// '{ "firstName":"Peter" , "lastName":"Jones" } ]}';

	let betterVideo = 0;
	let worseVideo = 0;
	if(document.getElementById("fas2").style.display == "none"){
		betterVideo = heart1.value;
		worseVideo = heart2.value;
	}
	else if (document.getElementById("fas1").style.display == "none"){
		betterVideo = heart2.value;
		worseVideo = heart1.value;
	}
	else{
		window.alert("please select a video");
		return;
	}

	let pref = {"better":betterVideo, "worse":worseVideo};
	
	// sendPostRequest("/insertPref",  JSON.parse(temp))
	sendPostRequest("/insertPref",  pref)
	.then(function(result){
		console.log(result);

		if(result != "pick winner"){
			window.location = "compare.html";
		}
		else{
			window.location = "winner.html";
		}
		
	})
	.catch(function (error){
		console.log("Error:", error);
	});
}