<template>
  <div class="home">
    <Navbar/>
    <b-container>
      <Filelist/>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import Filelist from "@/components/Filelist.vue";

export default {
  name: "file",
  components: {
    Navbar,
    Filelist
  }
};
</script>
