<template>
  <div class="home">
    <Navbar/>
    <b-container>
      <Rolelist/>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import Rolelist from "@/components/Rolelist.vue";

export default {
  name: "role",
  components: {
    Navbar,
    Rolelist
  }
};
</script>
