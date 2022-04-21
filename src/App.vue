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
#app html, body{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 0px;
  background-color: rgba(28, 28, 28, 0.9) !important;
  width:100%;
}

.main{
  overflow:hidden;
  width:100%
}

</style>
