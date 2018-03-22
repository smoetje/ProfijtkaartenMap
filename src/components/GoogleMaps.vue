<template>
  <div class="google-map" :id="mapName"></div>
</template>
<script>
  import axios from 'axios';
  import locaties from '../locaties';

  export default {
    name: 'google',
    props: ['name'],
    data: function () {
      return {
        mapName: this.name + "-map",
        markerCoordinates: [{
          latitude: 51.501527,
          longitude: -0.1921837
        }, {
          latitude: 51.505874,
          longitude: -0.1838486
        }, {
          latitude: 51.4998973,
          longitude: -0.202432
        }],
        currentLocation: null,
        map: null,
        bounds: null,
        markers: [],
        contactList: [],
        outputList: [],
        infoWindow: null
      }
    },
    beforeMount() {

    },
    mounted() {
      this.bounds = new google.maps.LatLngBounds();
      const element = document.getElementById(this.mapName)
      const mapCentre = this.markerCoordinates[0]
      const options = {
        center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude)
      }

      this.map = new google.maps.Map(element, options);
      this.markerCoordinates.forEach((coord) => {
        const position = new google.maps.LatLng(coord.latitude, coord.longitude);
        const marker = new google.maps.Marker({
          position,
          map: this.map
        });
        this.markers.push(marker)
        this.map.fitBounds(this.bounds.extend(position))
      });

      this.infoWindow = new google.maps.InfoWindow;

      // Try HTML5 geolocation.
      let that = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          that.infoWindow.setPosition(pos);
          that.infoWindow.setContent('Je bent hier.');
          that.infoWindow.open(that.map);
          that.map.setCenter(pos);
        }, function() {
          that.handleLocationError(true, that.infoWindow, that.map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        that.handleLocationError(false, that.infoWindow, that.map.getCenter());
      }


      this.init();

    },
    methods: {
      handleLocationError: function(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(this.map);
      },
      init: function() {
        this.contactList = locaties;
        this.geocoder();

      },
      geocoder: function(){
        let geocoder = new google.maps.Geocoder();
        let that = this;
        let address = [];
        this.contactList.forEach((elem) => {
          address.push(`${elem.adres}, ${elem.postcode} ${elem.stad}, ${elem.country}`);
          // console.log(address);
        });

        // https://stackoverflow.com/questions/19640055/multiple-markers-google-map-api-v3-from-array-of-addresses-and-avoid-over-query
        for(i=0;i<address.length;i++) {
          geocoder.geocode({ address }, function(results, status){
            if (status === 'OK') {
              console.log(results);
              const marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: that.map
              });
            } else {
              if(status === 'OVER_QUERY_LIMIT') {
                console.log('retry this element');

                alert('Geocoding unsuccesful for the following reason: ' + status);
              } else {
                alert('Geocoding unsuccesful for the following reason: ' + status);
              }
            }
          });
        }



      }
    },
  };
</script>
<style scoped>
  .google-map {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background: gray;
  }
</style>