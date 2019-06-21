<template>
  <div class="policylist">
    <b-row align-h="end">
      <b-col cols="auto" class="p-auto">
        <b-button v-b-modal.modal-1>New</b-button>
      </b-col>
    </b-row>

    <b-modal id="modal-1" ok-title="Add" title="New Policy" @ok="add">
      <b-row class="my-1">
        <b-col sm="2">
          <label for="input-default">Role:</label>
        </b-col>
        <b-col sm="10">
          <b-form-input v-model="policy.role" placeholder="Enter role"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="2">
          <label for="input-default">Path:</label>
        </b-col>
        <b-col sm="10">
          <b-form-input v-model="policy.path" placeholder="Enter path"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="2">
          <label for="input-default">Method:</label>
        </b-col>
        <b-col sm="10">
          <b-form-input v-model="policy.method" placeholder="Enter method"></b-form-input>
        </b-col>
      </b-row>
    </b-modal>

    <b-table caption-top :items="policies" :fields="fields" :filter="filter">
      <template slot="actions" slot-scope="data">
        <b-button variant="danger" @click="del(data.item)">Del</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Policylist",
  components: {},
  data() {
    return {
      policy: {
        role: "",
        path: "",
        method: ""
      },
      fields: [
        {
          key: "0",
          label: "Role"
        },
        {
          key: "1",
          label: "Path"
        },
        {
          key: "2",
          label: "Method"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      policies: [],
      filter: null
    };
  },
  created() {
    axios
      .get("/v1/ac/policy", {
        headers: {
          Authorization: localStorage.getItem("access_token")
        }
      })
      .then(response => {
        console.log(response.data);
        this.policies = response.data.data;
      })
      .catch(error => {
        alert(error.response.data.message);
        this.$router.push("/");
      });
  },
  methods: {
    del: function(data) {
      axios
        .delete(
          "/v1/ac/policy",
          {
            data: {
              role: data[0],
              path: data[1],
              method: data[2]
            },
            headers: {
              Authorization: localStorage.getItem("access_token")
            }
          }
        )
        .then(response => {
          console.log(response.data);
          this.refresh();
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    },
    add: function() {
      axios
        .post(
          "/v1/ac/policy",
          {
            role: this.policy.role,
            path: this.policy.path,
            method: this.policy.method
          },
          {
            headers: {
              Authorization: localStorage.getItem("access_token")
            }
          }
        )
        .then(response => {
          console.log(response.data);
          this.refresh();
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    },
    refresh: function() {
      axios
        .get("/v1/ac/policy", {
          headers: {
            Authorization: localStorage.getItem("access_token")
          }
        })
        .then(response => {
          console.log(response.data);
          this.policies = response.data.data;
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    }
  },
  computed: {}
};
</script>

<style>
.policylist {
  text-align: left;
}
</style>
