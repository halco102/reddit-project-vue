<template>
  <div class="main">
    <router-link to="/"></router-link>
    <router-view/>
  </div>
  
</template>

<script lang="ts">
import { defineComponent} from 'vue';


export default defineComponent({
  name: 'App',
  components: {
  }

});

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 0px;
}

.main{
  overflow:hidden;
  width:100%
}

</style>
