<template>
  <div id="app">
    <GoogleMaps v-on:startid="getStartid" name="google" v-bind:contacts="contacts" v-bind:selectedContactArrayId="infoArrId"></GoogleMaps>

    <h4>Overzicht verkoopspunten Profijtkaarten:</h4>
    <p>Klik op de kaart of in onderstaande lijst, voor meer details</p>
    <ul>
      <li v-for="(contact, index) in contacts" :key="contact.id" :value="contact" v-on:click="showMarkerInfo(index)">
        <a href="#">{{contact.naam}}</a>
      </li>
    </ul>
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
      infoArrId: -1
    }
  },
  beforeMount() {
    axios({
      method: 'get',
      url: `${this.$access.url}api/verkooppunten`,
    }).then((resp) => {
      //console.log(resp.data);
      //console.log("initial api call received");
      this.contacts = resp.data;

    }).catch((resp) => {
      console.log(resp);
      //alert('Adressen server momenteel niet toegankelijk, probeer het later eens opnieuw!')
    });
  },
  methods: {
    showMarkerInfo: function(index){
      this.infoArrId = index;
    },
    getStartid: function(resetValue){
      this.infoArrId = resetValue;
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
  margin-top: 0;
}

@media (max-width: 650px) {
  #app {
    margin-left: -18px;
    margin-right: -18px;
  }

  h4, p, ul {
    margin-left: 18px;
    margin-right: 18px;
  }
}

li {
  margin-left: 24px;
}

ul {
  list-style-type: square!important;
}

p, h4, li {
  text-align: left;
  font-family: Roboto,One Open Sans,Helvetica Neue,Helvetica,sans-serif;
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  text-shadow: none;
  color: rgb(0,84,165);
}

h4 {
  text-align: left;
  font-family: Roboto,One Open Sans,Helvetica Neue,Helvetica,sans-serif;
  font-size: 20px;
  font-weight: bold;
  font-style: normal;
  text-decoration: none;
  text-shadow: none;
  color: rgb(0,84,165);
}

</style>
