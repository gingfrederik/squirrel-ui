<template>
  <div>
    <Navbar/>
    <b-container>
      <b-button variant="success" size="lg" to="/login">Login</b-button>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

export default {
  name: "home",
  components: {
    Navbar
  },
  created() {
    axios
      .get("/v1/fs/", {
        headers: {
          Authorization: localStorage.getItem("access_token")
        }
      })
      .then(response => {
        console.log(response.data);
        this.files = response.data.data;
        this.$store.commit("setLoginStatus", true);
        this.$router.push("/file");
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("initStatus");
        this.$router.push("/");
      });
  }
};
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}

.btn-group-lg > .btn,
.btn-lg {
  padding: 2.5rem 5rem;
  font-size: 7.25rem;
}
</style>
