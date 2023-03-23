<template>
   <div>
     <div class="fav-holder" v-if="favorites.length !== 0">
       <WeatherComponent :mini="true" v-for="(city, index) in favorites" :key="'weather'+index"  :favorites="favorites" :countries="favorites" :id="index" :city="city"></WeatherComponent>
     </div>
     <div class="fav-holder" v-else>
        <h1>Favorites empty</h1>
     </div>
   </div>


</template>

<script>
import Icon from '@/components/Icon'
import Modal from '@/components/Modal'
import WeatherComponent from '@/components/WeatherComponent'



export default {
  components: {Icon,Modal,WeatherComponent},
  data() {
    return {
      favorites:[],

    }
  },
  methods: {

  },
  mounted() {
  },
  created() {
    this.favorites = JSON.parse(localStorage.getItem("countries") || '[]')

  },

}
</script>
<style>
.fav-holder {
  display: flex;
  flex-wrap: wrap;
}
.fav-holder .container-weather {
  margin: 10px;
}
.fav-holder h1{
  color: white;
  text-align: center;
  width: 100%;
}
</style>

