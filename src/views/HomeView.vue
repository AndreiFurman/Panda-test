<template>
   <div>
     <autocomplete @submit="onSubmit"  :search="search" :get-result-value="getResultValue" class="input-comp"></autocomplete>
     <div class="add-location-holder">
      <button class="button" @click="openModal">Add more location</button>
     </div>
     <div class="weather-main-holder">
      <WeatherComponent v-for="(city, index) in countries" :key="'weather'+index"  :favorites="favorites" :countries="countries" :id="index" :city="city"></WeatherComponent>
     </div>
     <Modal ref="modal_add">
       <template slot="modal">
         <h2>Add new location</h2>
         <autocomplete  @submit="addNewCard" :search="search" :get-result-value="getResultValue" class="input-comp"></autocomplete>
       </template>
     </Modal>

   </div>


</template>

<script>
import Icon from '@/components/Icon'
import Modal from '@/components/Modal'
import WeatherComponent from '@/components/WeatherComponent'

export const geoApiOptions = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "esGbwrm390mshS2BCl0RALxQRtZTp1W7sFMjsnyJlJzDXVkW0H",// enter your rapid api key here
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  },
};
export const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";

export default {
  components: {Icon,Modal,WeatherComponent},
  data() {
    return {
      query: '',
      countries: [],
      favorites:[],

    }
  },
  methods: {
    openModal(){
      this.$refs.modal_add.open();
    },
    search(input) {
      return new Promise((resolve) => {
        if (input.length < 3) {
          return resolve([])
        }

        fetch(`${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${input}`,
                geoApiOptions
        )
            .then((response) => response.json())
            .then((data) => {
              resolve(data.data);
            })
      })
    },
    addNewCard (results) {
      this.countries.push({latitude: results.latitude, longitude: results.longitude});
      this.$refs.modal_add.close();

    },
    deleteCard(index){
      this.countries.splice(index, 1);
    },
    onSubmit(results) {
      if(this.countries.length===0){
        this.countries.push({latitude: results.latitude, longitude: results.longitude});
      } else {
        this.$set(this.countries, 0, {latitude: results.latitude, longitude: results.longitude})
      }

    },
    getResultValue(result) {
      return result.name+', '+result.countryCode
    },


  },
  mounted() {
  },
  created() {
    this.favorites = JSON.parse(localStorage.getItem("countries") || '[]')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          position => {
            if(this.countries.length===0){
              this.countries.push({latitude: position.coords.latitude, longitude: position.coords.longitude});
            } else {
              this.$set(this.countries, 0, {latitude: position.coords.latitude, longitude: position.coords.longitude});
            }
          }
      );
    }
    else{
      console.log("Your browser does not support geolocation API")
    }
  },

}
</script>
<style>
.weather-main-holder{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
@media (min-width: 1200px) {
  .weather-main-holder{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
.add-location-holder{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 50px;
}
.input-comp {
  width: 100%;
  margin-bottom: 50px;
}
.input-comp input {

}

.logo-holder{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 0;
}

.link-holder{
  display: flex;
  margin: 20px 0;
}
.link-holder a{
  color: white;
  text-decoration: none;
  margin: 0 10px;
  transition: all .2s;
}
.link-holder a:hover{
  color: #6ec1fc;
  text-decoration: underline;
  margin: 0 10px;
}

.link-holder a.router-link-exact-active {
  color: #6ec1fc;
  text-decoration: underline;
}
.button {
  display: inline-block;
  padding: 5px;
  margin-right: 5px;
  height: 40px;
  min-width: 100px;
  background: #46aaf1;
  border: none;
  outline: none;
  color: white;
  font-family: inherit;
  font-weight: 400;
  font-size: 15px;
  border-radius: 3px;
  box-shadow: 0 5px 0px darken(#348aa7, 0%);
  border-bottom: 2px solid darken(#348aa7, 3%);
  cursor: pointer;
}
.button:hover {
  background: darken(#348aa7, 5%);
  box-shadow: 0 4px 1px darken(#348aa7, 5%);
  border-bottom: 2px solid darken(#348aa7r, 8%);
  transition: all 0.1s ease-in;
}
.button:active {
  transform: translateY(4px);
  border-bottom-width: 2px;
  box-shadow: none;
}

</style>
