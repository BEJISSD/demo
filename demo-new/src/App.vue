<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App',
    metaInfo() {
        return {
        }
    },
}
</script>
<style>
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #282e39;*/
  /*height: 100%;*/
  /*overflow: auto;*/
  /*padding: 0;*/
  /*margin: 0;*/
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  height: 100%;
  /*-webkit-touch-callout: none;*/
  /*-webkit-user-select: none;*/
  /*-khtml-user-select: none;*/
  /*-moz-user-select: none;*/
  /*-ms-user-select: none;*/
  /*user-select: none;*/
}

html {
  height: 100%;
}
</style>
