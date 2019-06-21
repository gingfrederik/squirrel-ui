<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
@import url(//fonts.googleapis.com/earlyaccess/notosanstc.css);

#app {
  font-family: 'Noto Sans TC', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.container {
    width: 100%;
    padding-top: 30px;
}

</style>
