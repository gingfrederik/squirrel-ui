<template>
  <div class="home">
    <Navbar/>
    <b-container>
      <Policylist/>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import Policylist from "@/components/Policylist.vue";

export default {
  name: "policy",
  components: {
    Navbar,
    Policylist
  }
};
</script>
