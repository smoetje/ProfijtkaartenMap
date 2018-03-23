<template>
  <div id="app">
    <GoogleMaps name="testje"></GoogleMaps>
  </div>
</template>

<script>
import GoogleMaps from './components/GoogleMaps'

export default {
  name: 'App',
  components: {
    GoogleMaps
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  margin-left: -18px;
  margin-right: -18px;
}
</style>
