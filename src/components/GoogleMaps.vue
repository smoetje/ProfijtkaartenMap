<template>
  <div>
    <p>Google Maps!</p>
    <div class="google-map" :id="mapName"></div>
  </div>
</template>

<script>
    export default {
        name: 'google-map',
        markerCoordinates: [{
            latitude: 51.501527,
            longitude: -0.1921837
        }, {
            latitude: 51.505874,
            longitude: -0.1838486
        }, {
            latitude: 51.21543,
            longitude: 2.928656
        }],
        props: ['name'],
        data: function () {
            return {
                mapName: this.name + "-map",
            }
        },
        mounted: function () {
            const element = document.getElementById(this.mapName)
            const options = {
                zoom: 13,
                center: new google.maps.LatLng(51.21543,2.928656)
            }
            const map = new google.maps.Map(element, options);
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .google-map {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background: gray;
  }
</style>
