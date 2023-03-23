<template>

     <div class="container-weather" :class="{mini: mini}">
       <div class="weather-side" >
         <div class="weather-gradient"></div>
         <div class="date-container">
           <h2 class="date-dayname">{{weather.dt| moment("dddd")}}</h2><span class="date-day">{{weather.dt| moment("DD MMMM YYYY")}}</span><i class="location-icon" data-feather="map-pin"></i><span class="location ">{{weather.name}}, {{country}}</span>
         </div>
         <div class="weather-container"><i class="weather-icon" data-feather="sun"></i>
           <h1 class="weather-temp">{{Math.trunc(temp)}}°C</h1>
<!--           <h3 class="weather-desc">{{weather.weather[0]?.main}}</h3>-->
         </div>
         <div class="weather-icon-holder" v-if="mini">
           <Icon id="star" @click.native="favoriteItem" :class="{active: isFavorite}"></Icon>
         </div>
       </div>
       <div class="info-side card" v-if="!mini">
         <div class="about">
           <p class="lead">Temperature in °C</p>
         </div>

         <canvas :id="'canvas'+id"></canvas>

         <div class="axis">
           <div class="tick" v-for="hour in hourlyWeather">
             <span class="day-number">{{hour.dt_txt| moment("HH:mm")}}</span>
             <span class="value value--this">{{Math.trunc(hour.main.temp)}}°C</span>
           </div>
         </div>
         <div class="weather-icon-holder">
           <Icon id="star" @click.native="favoriteItem" :class="{active: isFavorite}"></Icon>
           <Icon v-if="this.id!==0" @click.native="$refs.modal_delete.open()" id="trash"></Icon>
         </div>
       </div>
       <Modal ref="modal_fav">
         <template slot="modal">
           <h2 class="warning-text"> favorites no more than 5 items</h2>
         </template>
       </Modal>
       <Modal ref="modal_delete">
         <template slot="modal">
           <h2 class="warning-text">  We confirm the deletion</h2>
           <button @click="$refs.modal_delete.close()">No</button>
           <button @click="deleteItem">Yes</button>
         </template>
       </Modal>
     </div>
</template>

<script>
import Icon from '@/components/Icon'
import Chart from 'chart.js'
import Modal from '@/components/Modal'
export default {
  components: {Icon,Modal},
  props: {
    city: {},
    id: {},
    countries:{},
    favorites:{},
    mini: {default: false}
  },
  data() {
    return {
      temp:'',
      country:'',
      api_key: 'fa9a60209e48604f57ea12e353166603',
      url_base: 'https://api.openweathermap.org/data/2.5/',
      query: '',
      weather: {},
      hourlyWeather: [],
      chart: {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              fill: false,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 2,
              pointBackgroundColor: 'transparent',
              pointBorderColor: '#FFFFFF',
              pointBorderWidth: 3,
              pointHoverBorderColor: 'rgba(255, 255, 255, 0.2)',
              pointHoverBorderWidth: 10,
              lineTension: 0,
            }
          ]
        },
        options: {
          responsive: false,
          elements: {
            point: {
              radius: 6,
              hitRadius: 6,
              hoverRadius: 6
            }
          },
          legend: {
            display: false,
          },
          tooltips: {
            backgroundColor: 'transparent',
            displayColors: false,
            bodyFontSize: 14,
            callbacks: {
              label: function(tooltipItems, data) {
                return Math.trunc(tooltipItems.yLabel) + '°C';
              }
            }
          },
          scales: {
            xAxes: [{
              display: false,
              offset: true

            }],
            yAxes: [{
              display: false,
              offset: true,
            }]
          }
        },

      }
    }
  },
  computed:{
    isFavorite(){
      return this.favorites.some(f=> f.city === this.weather.name)
    }
  },
  watch: {
    city: {
      handler(newCity) {
        this.onSubmit(newCity)
      },
      immediate: true
    }
  },
  methods: {
    deleteItem(){

      this.$parent.deleteCard(this.id);
      this.$refs.modal_delete.close()
    },
    favoriteItem() {
      if(this.isFavorite){
        this.favorites.splice(this.id, 1);
        localStorage.setItem("countries", JSON.stringify(this.favorites));
      }else{
          if(this.favorites.length>=5){
            this.$refs.modal_fav.open()
          } else {
            this.favorites.push({latitude: this.city.latitude, longitude: this.city.longitude, city: this.weather.name})
            localStorage.setItem("countries", JSON.stringify(this.favorites));
          }
      }

    },
    onSubmit(result) {
      fetch(`${this.url_base}weather?lat=${result.latitude}&lon=${result.longitude}&units=metric&APPID=${this.api_key}&cnt=5`)
          .then(res => {
            return res.json();
          }).then(data => {
            this.weather = data;
            this.country = this.weather.sys.country
            this.temp = this.weather.main.temp
          });
      if(this.mini){
        fetch(`${this.url_base}forecast?lat=${result.latitude}&lon=${result.longitude}&units=metric&APPID=${this.api_key}&cnt=5`)
            .then(res => {
              return res.json();
            }).then(this.setHourly);
      } else {
        fetch(`${this.url_base}forecast?lat=${result.latitude}&lon=${result.longitude}&units=metric&APPID=${this.api_key}&cnt=5`)
            .then(res => {
              return res.json();
            }).then(this.setHourly);
      }

    },
    setHourly (results) {
      this.hourlyWeather = results.list;
      this.chart.data.labels = [];
      this.chart.data.datasets[0].data = [];
      this.hourlyWeather.forEach(element => {
        this.chart.data.datasets[0].data.push(Math.trunc(element.main.temp) );
        this.chart.data.labels.push(this.$moment(element.dt_txt).format('HH:mm'))
      });


      const ctx = document.getElementById('canvas'+this.id);
      new Chart(ctx, this.chart);

    },
  },
  mounted() {

  },


}
</script>
<style scoped>
.warning-text{
  color: black;
         }
  .icon {
    width: 20px;
    height: 20px;
    fill: white;
    margin: 9px 0;
    cursor: pointer;
    transition: all .2s;

  }
  .icon:hover{

    fill: rgba(22, 126, 245, 0.86);
  }
  .icon.active{
    fill: rgba(22, 126, 245, 0.86);
  }
  .weather-icon-holder{
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
  }
  .container-weather {
    border-radius: 25px;

    color: #ffffff;

    margin-bottom: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .container-weather.mini .weather-side{
    height: 200px;
  }

  .weather-side {
    position: relative;
    height: 400px;
    border-radius: 25px;
    background-image: url("https://images.unsplash.com/photo-1559963110-71b394e7494d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80");
    width: 272px;
    -webkit-box-shadow: 0 0 20px -10px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 20px -10px rgba(0, 0, 0, 0.2);
    -webkit-transition: -webkit-transform 300ms ease;
    transition: -webkit-transform 300ms ease;
    -o-transition: transform 300ms ease;
    transition: transform 300ms ease;
    transition: transform 300ms ease, -webkit-transform 300ms ease;
    -webkit-transform: translateZ(0) scale(1.02) perspective(1000px);
    transform: translateZ(0) scale(1.02) perspective(1000px);
    float: left;
    z-index: 1;
  }

  .weather-side.mini{

  }
  .weather-gradient {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: var(--gradient);
    border-radius: 25px;
    opacity: 0.8;
  }

  .date-container {
    position: absolute;
    top: 25px;
    left: 25px;
  }

  .date-dayname {
    margin: 0;
  }

  .date-day {
    display: block;
  }

  .location {
    display: inline-block;
    margin-top: 10px;
  }

  .location-icon {
    display: inline-block;
    height: 0.8em;
    width: auto;
    margin-right: 5px;
  }

  .weather-container {
    position: absolute;
    bottom: 25px;
    left: 25px;
  }

  .weather-temp {
    margin: 0;
    font-weight: 700;
    font-size: 4em;
  }

  .info-side {
    position: relative;
    float: left;
    height: 400px;
    padding-top: 25px;
    -webkit-box-shadow: 0 0 70px -10px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 70px -10px rgba(0, 0, 0, 0.2);
    background-color: #222831;
    border-radius: 25px;
  }


  .location-button .feather {
    height: 1em;
    width: auto;
    margin-right: 5px;
  }
  .card canvas {

    width: 270px;

  }

  .card .about {
    height: 185px;
    padding: 20px;
    box-sizing: border-box;
  }

  .card .about h3,
  .card .about .lead {
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 400;
  }

  .card .about h3 {
    font-size: 24px;
    color: #fff;
  }

  .card .about .lead {
    color: #eee;
  }

  .card .info {
    float: left;
    padding: 10px 30px 10px 0;
  }

  .card .info p {
    font-size: 11px;
    color: #aaa;
    font-weight: 300;
  }



  .axis {
    position: absolute;
    color: #fff;
    z-index: 1;
    text-transform: uppercase;
    display: flex;
    width: 100%;
    bottom: 0;
  }

  .axis .tick {
    flex: 1;
    position: relative;
    font-size: 11px;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    line-height: 20px;
  }

  .axis .tick::after {
    content: "";
    position: absolute;
    display: block;
    right: 0;
    bottom: 0;
    width: 1px;
    height: 200px;
    background: rgba(255, 255, 255, 0.2);
  }
  .axis .tick:last-child::after {
    width: 0px;
  }

  .axis .tick .value {
    transform: translateY(-240px);
    opacity: 0;
    transition: all 0.3s;
    position: absolute;
    top: 20px;
    left: 0;
    color: #fff;
    border-radius: 2px;
    width: 100%;
    line-height: 20px;
  }

  .axis .tick .value.value--this {
    transform: translateY(-220px);
    display: block;
    opacity: 0.4;
  }



</style>
