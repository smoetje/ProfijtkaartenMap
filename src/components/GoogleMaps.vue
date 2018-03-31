<template>
  <div>
    <div class="google-map" :id="mapName"></div>

  </div>
</template>
<script>
  import axios from 'axios';
  import matrooskaart from '../assets/matrooskaart.svg';

  export default {
    name: 'google',
    props: ['name', 'contacts', 'infoId'],
    data: function () {
      return {
        mapName: this.name + "-map",
        currentLocation: null,
        map: null,
        bounds: null,
        markers: [],
        contactList: this.contacts,
        infoWindow: null
      }
    },
    watch: {
      contacts: function(){
        console.log(this.contacts);
        this.contactList = this.contacts; // Watcher gebruiken om ingeladen API property in PARENT door naar CHILD te zetten
        this.verifyAllCoordinates(); // Eens parent data ingeladen, start dan de applicatie
      },
      infoId: function(){
        console.log("Receiving new selection ID");
        console.log("this.infoId");
      }
    },
    beforeMount() {
    },
    mounted() {
      this.bounds = new google.maps.LatLngBounds();
      const element = document.getElementById(this.mapName);
      const mapCentre = {
        latitude: 51.2299874,
        longitude: 2.9223107000000255
      };
      const options = {
        center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude)
      };
      this.map = new google.maps.Map(element, options);
      this.infoWindow = new google.maps.InfoWindow;
    },
    methods: {
      handleLocationError: function(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(this.map);
      },
      verifyAllCoordinates: function() {
        // Check coordinates & add missing data
        for (let i = 0; i < this.contactList.length; i++){
          //console.log(this.contactList[i].coord);
          if(this.contactList[i].coord === null){
            // Search coordinates (& save later to server)
            let geocoder = new google.maps.Geocoder();
            let address = `${this.contactList[i].adres}, ${this.contactList[i].postcode} ${this.contactList[i].stad}, ${this.contactList[i].country}`;
            let id = this.contactList[i].id;
            let url = this.$access.url;
            // console.log(id);
            geocoder.geocode({ address: address }, function(results, status) {
              if (status === 'OK') {
                let coord = {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng()
                };
                axios({
                  method: 'put',
                  url: `${this.url}api/verkooppunten/${this.id}`,
                  data: {
                    id: this.id,
                    coord: JSON.stringify(coord)
                  }
                }).then((resp) => {
                  // console.log(resp.data);

                }).catch((resp) => {
                  // console.log(resp);
                  console.warn('Server not responding!')
                });

              } else {
                console.warn('Geocoding not succesful for this address: ' + address + '\nReason: ' + status);
              }
            }.bind( { id: id, url: url } ));
          } else {
            this.putMarkers(this.contactList[i]);
          }
        }
      },
      putMarkers: function(contact) {
        let that = this;
        let coord = JSON.parse(contact.coord)
        const position = new google.maps.LatLng(coord.lat, coord.lng);

        let contentString = `<div id="content">
          <div id="siteNotice">
          </div>
          <h1 id="firstHeading" class="firstHeading">${contact.naam}</h1>
          <div id="bodyContent">
          <p>${contact.adres}</p>
          <p>${contact.postcode} ${contact.stad}</p>
          <p>${contact.tel}</p>
          </div></div>`;

        const infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        let icon = {
          url: matrooskaart,
          anchor: new google.maps.Point(25,50),
          scaledSize: new google.maps.Size(50,50)
        };

        const marker = new google.maps.Marker({
          position,
          animation: google.maps.Animation.DROP,
          icon: icon,
          map: that.map
        });

        marker.addListener('click', function() {
          infowindow.open(that.map, marker);
        });

        this.markers.push(marker);

        // console.log(this.markers);

        this.map.fitBounds(that.bounds.extend(position))
      }
    },
  };
</script>
<style scoped>
  .google-map {
    width: inherit;
    min-height: 430px;
    margin: 0 auto;
    background: gray;
    margin-bottom: 10px;
  }
</style>