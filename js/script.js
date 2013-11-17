$(document).ready(function(){
	
	init();
	
	function init(){
		
		playerNum = 1;
		playerNames = new Array();
		playerDivWidth = 98;
		
	} //end init function
	
	$("#addPlayer").click(addPlayer);
	
	function addPlayer(){
		
		console.log("working");
		
		playerNames[playerNum] = $("#playerName").val();
		
		$("#players div:nth-child(" + playerNum + ")").html("<h3>" + playerNames[playerNum] + "</h3>");
		
		$.get("newPlayer.html", function(data){
			$("#players").append(data);
			$("#players > div").css("width", playerDivWidth + "%");
		});
		
		playerNum++;
		
		playerDivWidth = playerDivWidth/playerNum;
		$("#players > div").css("width", playerDivWidth + "%");
		
		console.log(playerDivWidth);
		
	} //end addPlayer function
		
});