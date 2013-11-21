$(document).ready(function(){
	
	init();
	
	var trackListing = $("#searchResults ul");
	var playlist = $("#playlist ul");
	var position = $("#position");
    var result;
   
    SC.initialize({
        client_id: "3dcdbb4bbe904995c874b0b6196762e1",
        redirect_url: "http://127.0.0.1"
    });
	
	function init(){
		
		$("#pageTitle").html("Welcome!");
		
	} //end init function
	
	$("#search").click(function(){
		//change page title
		$("#pageTitle").html("Search Results");
		
		//get the search value
		var searchValue = $("#searchingFor").val();
		
		//list the songs of that value
		listSongs(searchValue);
	}); //end search function
	
	// this plays a song
	function playSong(trackID){
		
		SC.stream("/tracks/" + trackID, function(sound){
			sound.play({
				whileplaying: function(){
					position.val(this.position/this.duration);
				} //end whilePlaying function
			}); //end sound.play
		}); //end SC.stream
		
	} //end playSong function
		
	$("#playlist").on("click", "li", function(event){
		var clickedElement = $(event.target);
		
		//get the associated track of the clicked element
		var trackID = clickedElement.data("trackID");
		
		//show the track title for "now playing"
		$("#nowPlaying span").html(clickedElement.html());
		
		//play the selected song
		playSong(trackID);
	});
	
	//respond to a click on a list item in track listing
	//for ANY LIST ITEM regardless of when it was added
	$("#searchResults").on("click", "li", function(event){
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
		SC.get("/tracks", {limit: 10, q: query}, function(tracks){
			//store result for later
			result = tracks;
			
			//clear out track listing
			trackListing.empty();
			
			//populate new values
			for(var i in tracks){
				var curTrack = tracks[i];
				
				trackListing.append("<li data-index='" + i + "'>" + curTrack.title + "</li>");
			}
		});
	} //end listSongs function
		
});