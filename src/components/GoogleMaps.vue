<template>
  <div>
    <div class="google-map" :id="mapName"></div>

  </div>
</template>
<script>
  import axios from 'axios';
  import matrooskaart from '../assets/profijtkaart.svg';

  export default {
    name: 'google',
    props: ['name', 'contacts', 'selectedContactArrayId'],
    data: function () {
      return {
        mapName: this.name + "-map",
        currentLocation: null,
        map: null,
        bounds: null,
        markers: [],
        contactList: this.contacts,
        showContactWindow: null,
        contentStrings: [],
        previousBox: null,
        previousMarker: null,
      }
    },
    watch: {
      contacts: function(){
        this.contactList = this.contacts; // Watcher gebruiken om ingeladen API property in PARENT door naar CHILD te zetten
        this.verifyAllCoordinates(); // Eens parent data ingeladen, start dan de applicatie
      },
      selectedContactArrayId: function(){
        if(this.selectedContactArrayId > -1) {
          let coord = JSON.parse(this.contacts[this.selectedContactArrayId].coord);
          const position = new google.maps.LatLng(coord.lat, coord.lng);

          let icon = {
            url: matrooskaart,
            anchor: new google.maps.Point(25,50),
            scaledSize: new google.maps.Size(50,50)
          };

          if(this.previousBox){
            this.previousBox.close();
            this.previousMarker.setMap(null);
          }

          this.previousMarker = new google.maps.Marker({
            position,
            animation: google.maps.Animation.DROP,
            icon: icon,
            map: this.map
          });

          let that = this;
          this.previousBox = new google.maps.InfoWindow({
            content: this.contentStrings[this.selectedContactArrayId]
          });

          this.previousBox.open(that.map, this.previousMarker);

          google.maps.event.addListener(this.previousBox, 'closeclick', function(){
            that.previousBox = null;
            that.previousMarker.setMap(null);
            // Uitsturen naar parent die infoArrId terug op -1 zet... (anders slechts 1x klikbaar omdat watch niet verandert
            that.$emit('startid', -1 );
          });

          this.map.setZoom(16);
          this.map.setCenter(this.previousMarker.position);
        }
      },
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
          <h1 style="font-size: 18px; margin-top: 6px">${contact.naam}</h1>
          <div id="bodyContent">
          <p class="addressline" style="margin-bottom: 0;">${contact.adres}</p>
          <p>${contact.postcode} ${contact.stad}</p>
          <p style="margin-bottom: 0; font-size: 14px;">${contact.tel}</p>
          </div></div>`;

        this.contentStrings.push(contentString);

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