$(document).ready(function(){
	
	init();
	
	var trackListing = $("#searchResults");
	var playlist = $("#playlist");
	var position = $("#position");
    var result, searchValue, currentlyPlayingSound, currentlyPlayingIndex, durationOfTrack;
   
    SC.initialize({
        client_id: "3dcdbb4bbe904995c874b0b6196762e1",
        redirect_url: "http://127.0.0.1"
    });
	
	function init(){
		//displays initial page content
		addPageContent("home");
		
		//make a new jukebox
		var jukebox = new Jukebox("#playlist", "#position", SC);
	} //end init function
	
	$("#goTo-home").click(function(){
		addPageContent("home");
		$("#searchResults").html("");
	}); //end click function on "go to home"
	
	function addPageContent(pageName){
		
		switch(pageName){
			case "home":
				$("#pageTitle").html("Welcome!");
				$("#pageContent").html("This is a jukebox application created by Rachelle Bennington. " +
									"You can click the links in the navigation to take you to the top 10 results for that genre." +
									" If you want to search for something specific, use the search bar at the top right of the page.");
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
		var m=addZero(date.getUTCMinutes());
		var s=addZero(date.getUTCSeconds());
		durationOfTrack = m + ":" + s;
	}
	
	$("#btnStop").click(function(){
		jukebox.stop();
	}); //end function on button button click stop
	
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
		
		$("#nothingCurrently").hide();
		
		//add the track title to our playlist div
		playlist.append(clonedElement);
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
					eachTrack += "<img src='http://placehold.it/100x100'>";
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