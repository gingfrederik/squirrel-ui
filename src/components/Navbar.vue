<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">Fileserver</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item v-if="this.$store.state.loginStatus === true" to="policy">Policy</b-nav-item>
          <b-nav-item v-if="this.$store.state.loginStatus === true" to="role">Role</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav v-if="this.$store.state.loginStatus === true" class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template slot="button-content">
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item @click="this.logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  created() {},
  methods: {
    logout: function() {
      localStorage.clear("access_token");
      this.$router.push("/");
      this.$store.commit("initStatus");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
