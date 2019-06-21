<template>
  <div>
    <Navbar/>
    <b-container>
      <b-form class="form-signin" @submit.prevent="onSubmit">
        <b-form-group id="input-user-group">
          <b-form-input
            id="input-user"
            v-model="username"
            type="text"
            required
            placeholder="Enter username"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-password-group">
          <b-form-input
            id="input-password"
            v-model="password"
            type="password"
            required
            placeholder="Enter password"
            autocomplete="current-password"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

export default {
  name: "login",
  components: {
    Navbar
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  created() {},
  methods: {
    onSubmit: function() {
      axios
        .post("/v1/user/login", {
          name: this.username,
          password: this.password
        })
        .then(response => {
          console.log(response.data);
          var token = response.data.access_token;
          localStorage.setItem("access_token", "Bearer " + token);
          this.$store.commit("setLoginStatus", true);
          this.$router.push("/file");
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    }
  },
  computed: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin {
  font-weight: 400;
}
.form-signinl {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin {
  z-index: 2;
}
.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>

