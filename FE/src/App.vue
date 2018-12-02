<template>
  <div id="app">
    <NavBarUser/>
    <b-container>
      <router-view/>
    </b-container>
  </div>
</template>

<script>
import NavBarUser from './components/NavBarUser'
export default {
  name: 'App',
  components:{
    NavBarUser
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
}
</style>
