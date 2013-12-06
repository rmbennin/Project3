//self-executing anonymous function
(function() {
	
	//class-like object
	var Jukebox = function(playlistRef, positionRef, SC){
		//store a reference to this object
		var me = this;
		
		this.currentlyPlayingSound;
		this.currentlyPlayingIndex;
		this.position = $(positionRef);
		this.playlist = $(playlistRef);
		this.sc = SC;
		
		this.playlist.on("click", "button", function(event){
			var clickedElement = $(event.target);
			
			//update what is currently playing
			me.currentlyPlayingIndex = clickedElement.index();
			
			//get the associated track of the clicked element
			var trackID = clickedElement.data("trackID");
			
			SC.get("/tracks/" + trackID, function(track){				
				//show the track title for "now playing"
				$("#nowPlaying span").html(track.title);
			}); //end SC.stream
			
			//play the selected song
			me.playSong(trackID);
		}); //end playlist button onclick function
	} //end Jukebox "object"
	
	//play next song
	Jukebox.prototype.playNext = function(){
		//try to play next song
		this.currentlyPlayingIndex++;
										
		//make sure there is a next song to play
		if(this.currentlyPlayingIndex < $("#playlist div button").size()){
			var nextElement = this.playlist.find("button").eq(this.currentlyPlayingIndex);
												
			//update the now playing HTML
			$("#nowPlaying span").html(nextElement.html());
			
			//play the next song
			this.playSong(nextElement.data("trackID"));
		}
	} //end playNext prototype
	
	//play a song
	Jukebox.prototype.playSong = function playSong(trackID){
		//store a reference to this object
		var me = this;
		
		//make sure this sound exists
		if(this.currentlyPlayingSound){
			//if it does exist, stop it
			this.currentlyPlayingSound.stop();
		}
		
		SC.stream("/tracks/" + trackID, function(sound){
			me.currentlyPlayingSound = sound;
			
			sound.play({
				whileplaying: function(){
					me.position.val(this.position/this.duration);
				},
				onfinish: function(){
					me.playNext();
				}
			}); //end sound.play
		}); //end SC.stream
	} //end playSong prototype
	
	//stop currently playing song
	Jukebox.prototype.stop = function(){
		if(this.currentlyPlayingSound){
			this.currentlyPlayingSound.pause();
		}
	} //end stop prototype
	
	Jukebox.prototype.resume = function(){		
		if(this.currentlyPlayingSound.pause()){
			this.currentlyPlayingSound.resume();
		}
	} //end pause prototype
		
	//export jukebox for everybody to use
	window.Jukebox = Jukebox;
	
})();