<template>
  <div id="app">
    <GoogleMaps name="google" v-bind:contacts="contacts" v-bind:infoId="infoId"></GoogleMaps>

    <p>Matrooskaarten kunnen worden aangekocht op de volgende locaties:</p>
    <ul>
      <li v-for="contact in contacts" :key="contact.id" :value="contact" v-on:click="showMarkerInfo(contact.id)">
        {{ contact.id }} {{contact.naam}}
      </li>
    </ul>
    <button v-on:click="showMarkerInfo">test</button>

  </div>
</template>

<script>
import GoogleMaps from './components/GoogleMaps'
import axios from 'axios';

export default {
  name: 'App',
  components: {
    GoogleMaps
  },
  data: function () {
    return {
      contacts: [],
      infoId: null
    }
  },
  beforeMount() {
    axios({
      method: 'get',
      url: `${this.$access.url}api/verkooppunten`,
    }).then((resp) => {
      //console.log(resp.data);
      console.log("initial api call received");
      this.contacts = resp.data;

    }).catch((resp) => {
      console.log(resp);
      //alert('Adressen server momenteel niet toegankelijk, probeer het later eens opnieuw!')
    });
  },
  methods: {
    showMarkerInfo: function(id){
      console.log("show marker");
      console.log(id);
    }
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
}

@media (max-width: 650px) {
  #app {
    margin-left: -18px;
    margin-right: -18px;
  }
}

p, li {
  text-align: left;
  font-family: Roboto,One Open Sans,Helvetica Neue,Helvetica,sans-serif;
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  text-shadow: none;
  color: rgb(0,84,165);

}

</style>
