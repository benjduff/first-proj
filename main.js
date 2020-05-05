var map, infoWindow;
var costValue = 1; //default value for selected cost.

  window.addEventListener('load', function initMap() { //initiates the map. Displays in element "map" and sets zoom to 12.
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
    });

    if (navigator.geolocation) {   // Try HTML5 geolocation.
        navigator.geolocation.watchPosition(function(position){ //gets users lat + long, sets them to 'coords'. Sets map center to users coordinates
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var accuracy = position.coords.accuracy;
        var coords = new google.maps.LatLng(latitude, longitude);
        map.setCenter(coords);

          var e = document.getElementById("distDropdown");
          var getSelected = e.options[e.selectedIndex].value; //gets selected travel distance from distDropdown element.
          // e.options[e.selectedIndex].value is getting null value  --- "Uncaught TypeError: Cannot read property 'options' of null"
          if (getSelected == "1") {
            alert("travelDistance set to 1km");
            var travelDistance = 1000;
          }else {
            alert("shit");
          }

          if (document.getElementById('radioCost1').checked) { //checks radio buttons 1-5 to find which is selected and gets the value of the selected radio button.
            costValue = document.getElementById('radioCost1').value;
          } else if (document.getElementById('radioCost2').checked) {
            costValue = document.getElementById('radioCost2').value;
          } else if (document.getElementById('radioCost3').checked) {
            costValue = document.getElementById('radioCost3').value;
          } else if (document.getElementById('radioCost4').checked) {
            costValue = document.getElementById('radioCost4').value;
          } else {
            costValue = document.getElementById('radioCost5').value;
          }

        var marker = new google.maps.Marker({ //places marker on users coordinates to visualise current position.
            map: map,
            position: coords,
            title: 'Current Location',
            visible: true
        });
        marker.setMap(map);

        var circle = new google.maps.Circle({ // Add circle overlay and bind to Current Location Marker
          map: map,
          radius: travelDistance,   //sets radius of circle overlay to users selected travel distance.
          fillColor: '#AA0000' // set circle overlay colour.
        });
        circle.bindTo('center', marker, 'position'); // binds to marker.

        infowindow = new google.maps.InfoWindow(); //initiates new info window.
        var service = new google.maps.places.PlacesService(map); //initiates Google Places service.
        service.nearbySearch({ //searches within selected tracel distance for restaurants.
          location: coords,
          radius: travelDistance,
          type: ['restaurant']
        }, callback, travelDistance);

        function callback(results, status) { // places marker on every restaurant found within selected travel distance.
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
          }
        }

        function createMarker(place) { // creates marker for new places.
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

          google.maps.event.addListener(marker, 'click', function() { // shows info of place in an 'infowindow' hen clicked on.
            infowindow.setContent(place.name);
            infowindow.open(map, this);
          });
        }
        console.log(travelDistance);
        console.log(costValue);

      },function error(msg){alert('Please enable your GPS position future.'); // error for GPS not enabled.

    }, {maximumAge:600000, timeout:5000, enableHighAccuracy: true}); // sets search time limit and accuracy.
    } else {
      handleLocationError(false, infoWindow, map.getCenter()); // Browser doesn't support Geolocation.
    }
}, false);
  /*function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }*/
