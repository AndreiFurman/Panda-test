<template>
  <div id="app">
    <div class="container">
      <div class="logo-holder">
        <Icon id="logo"></Icon>
        <div class="link-holder">
          <router-link to="/">Home</router-link>
          <router-link to="favorite">Favorite</router-link>
        </div>
      </div>
      <router-view/>
    </div>
  </div>

</template>
<script>
import Icon from '@/components/Icon'

export default {
  components: {Icon},
}
</script>
<style>
#app{
  width: 100%;
}
:root {
  --gradient: linear-gradient(135deg, #72edf2 10%, #5151e5 100%);
}

* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 1.25em;
}

.clear {
  clear: both;
}

body {
  margin: 0;
  width: 100%;
  height: 100vh;
  font-family: "Montserrat", sans-serif;
  background-color: #343d4b;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.container {
  max-width: 1200px;
  padding: 0 15px;
  margin: 0 auto;
}


</style>
