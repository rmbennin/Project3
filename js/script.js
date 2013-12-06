$(document).ready(function(){
	
	init();
	
	var trackListing = $("#searchResults");
	var playlist = $("#playlist div");
	var position = $("#position");
    var result, searchValue, currentlyPlayingSound, currentlyPlayingIndex, durationOfTrack, playlistLength;
	//make a new jukebox
	var jukebox = new Jukebox("#playlist div", "#position", SC);
	
	window.setInterval(function(){
		//hides "nothing currently playing"
		if($("#playlist div button").size() > 0){
			$("#nothingCurrently").hide();
		} else {
			$("#nothingCurrently").show();
		}
	}, 50);
   
    SC.initialize({
        client_id: "3dcdbb4bbe904995c874b0b6196762e1",
        redirect_url: "http://127.0.0.1"
    });
	
	function init(){
		//displays initial page content
		addPageContent("home");
		
		playlistLength = 0;
	} //end init function
	
	$("#playlist div").on("click", "span", function(){
		//get number of button clicked on from id
		var clickedOnNum = $(this).attr("class");
				
		for(i=0; i <= clickedOnNum.length; i++){
			$('.' + clickedOnNum).remove();
		}
	});
	
	$("#goTo-home").click(function(){
		addPageContent("home");
		$("#searchResults").html("");
	}); //end click function on "go to home"
	
	function addPageContent(pageName){
		switch(pageName){
			case "home":
				$("#pageTitle").html("Welcome!");
				$("#pageContent").html("This is a jukebox application created by Rachelle Bennington. " +
									" If you want to search for something specific, use the search bar at the top right of the page." +
									" Click on the square next to 'Playlist' to stop the playlist," +
									" and the play button to resume to your playlist.");
				break;
			case "search":
				$("#pageTitle").html("Search Results");
				$("#pageContent").html("Displaying search results for '" + searchValue + "'...");
				break;
		} //end switch statement
	} //end addPageContent function
	
	function addZero(i) {
		if (i < 10){
			i = "0" + i;
		}
		
		return i;
	} //end addZero function
	
	function getTrackTime(milliseconds){
		var date = new Date(milliseconds);
		var m = addZero(date.getUTCMinutes());
		var s = addZero(date.getUTCSeconds());
		durationOfTrack = m + ":" + s;
	}
	
	$("#btnStop").click(function(){
		jukebox.stop();
	}); //end btnStop click function
	
	$("#btnPlay").click(function(){
		jukebox.resume();
	}); //end btnPause click function
	
	$("#search").click(function(){		
		//get the search value
		searchValue = $("#searchingFor").val();
		
		addPageContent("search");
		
		//list the songs of that value
		listSongs(searchValue);
	}); //end search function
	
	//respond to a click on a list item in track listing
	//for ANY LIST ITEM regardless of when it was added
	$("#searchResults").on("click", "button", function(event){
		var clickedElement = $(event.target);
		
		//get index of the index of the data associated with clicked element
		var arrayIndex = clickedElement.data("index");
		
		//get the extra data from the result array
		var associatedData = result[arrayIndex];
		
		//make a clone; it's the same but double
		var clonedElement = clickedElement.clone();
				
		//add some extra data to the cloned element
		//in specific, the trackID to play whenever this item is clicked
		clonedElement.data("trackID", associatedData.id);
			
		//changes button text to title of song	
		SC.get("/tracks/" + clonedElement.data("trackID"), function(track){
			//add the track title to our playlist div
			playlist.append(clonedElement);
			
			//show the track title for "now playing"
			clonedElement.html(track.title);
			
			//convert playlistLength number to string so we can add it to the class name
			playlistLength = String(playlistLength);
			
			//add unique class to button element
			clonedElement.addClass(playlistLength);
			
			//add button with same unique class as button
			playlist.append("<span class='" + playlistLength + "'>Remove Song</span><br class='" + playlistLength + "'>");
			
			//add 1 to playlistLength
			playlistLength ++;
		}); //end SC.stream
	}); //end on click function
	
	//lists songs for us
	function listSongs(query){
		SC.get("/tracks/", {limit: 10, q: query}, function(tracks){
			
			//store result for later
			result = tracks;
			
			//clear out track listing
			trackListing.empty();
			
			//populate new values
			for(var i in tracks){
				var curTrack = tracks[i];
								
				getTrackTime(curTrack.duration);
				
				var eachTrack = "<div>";
					
				//add associating img if there is one... otherwise add placeholder			
				if(curTrack.artwork_url){
					eachTrack += "<img src='" + curTrack.artwork_url + "'>";
				} else {
					eachTrack += "<img src='assets/placeholder.png'>";
				} //end if/else statement
				
				//add track genre
				eachTrack += "<p><span class='trackGenre'>" + curTrack.genre + "</span>";
				
				//add track title
				eachTrack += "<span class='trackTitle'>" + curTrack.title + "</span>";
				
				//add track time
				eachTrack += "<span class='trackDuration'>" + durationOfTrack + "</span>";
				
				//add associating description if there is one... otherwise add placeholder
				if(curTrack.description){
					eachTrack += "<span class='trackDescription'>" + curTrack.description + "</span>";
				} else {
					eachTrack += "<span class='trackDescription'>No description for this track.</span>";
				} //end if/else statement
				
				//add "add to playlist" button w/data index
				eachTrack += "<button data-index='" + i + "'>Add To Playlist</button>";
								
				//end track info
				eachTrack += "</p></div>";
			
				trackListing.append(eachTrack);
			} //end for loop
			
		});
	} //end listSongs function
		
});