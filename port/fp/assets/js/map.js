$(document).ready(function LoadGmaps() {
		
		var myLatlng = new google.maps.LatLng(38.8958561,-77.0097868);
		
		var myOptions = {
			zoom: 16,
			center: myLatlng,
			disableDefaultUI: true,
			panControl: false,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			},

			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
			},
			streetViewControl: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
			}

		var map = new google.maps.Map(document.getElementById("MyGmaps"), myOptions);
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title:"444 North Capitol St., N.W., Washington, D.C. 20001"
		});
		
		var infowindow = new google.maps.InfoWindow({
			content: "444 North Capitol St., N.W., Suite 605, Washington, D.C. 20001"
			});
			google.maps.event.addListener(marker, "click", function() {
				infowindow.open(map, marker);
			});
});

/* this part goes insert now here */