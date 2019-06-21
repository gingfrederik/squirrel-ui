<template>
  <div class="rolelist">
    <b-row align-h="end">
      <b-col cols="auto" class="p-auto">
        <b-button v-b-modal.modal-new>New</b-button>
      </b-col>
      <b-col cols="auto" class="p-auto">
        <b-button v-b-modal.modal-add>Add</b-button>
      </b-col>
    </b-row>

    <b-modal id="modal-new" ok-title="New" title="New role" @ok="add">
      <b-row class="my-1">
        <b-col sm="2">
          <label for="input-default">Role:</label>
        </b-col>
        <b-col sm="10">
          <b-form-input v-model="addRoleUser.role" placeholder="Enter role name"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="2">
          <label for="input-default">User:</label>
        </b-col>
        <b-col sm="10">
          <b-form-select v-model="addRoleUser.user" :options="userOptions" class="mb-3">
            <template slot="first">
              <option :value="null" disabled>-- Please select a user --</option>
            </template>
          </b-form-select>
        </b-col>
      </b-row>
    </b-modal>

    <b-modal id="modal-add" ok-title="Add" title="Add role for user" @ok="add">
      <b-row class="my-1">
        <b-col sm="2">
          <label for="input-default">Role:</label>
        </b-col>
        <b-col sm="10">
          <b-form-select v-model="addRoleUser.role" :options="roleOptions" class="mb-3">
            <!-- This slot appears above the options from 'options' prop -->
            <template slot="first">
              <option :value="null" disabled>-- Please select a role --</option>
            </template>
          </b-form-select>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="2">
          <label for="input-default">User:</label>
        </b-col>
        <b-col sm="10">
          <b-form-select v-model="addRoleUser.user" :options="userOptions" class="mb-3">
            <!-- This slot appears above the options from 'options' prop -->
            <template slot="first">
              <option :value="null" disabled>-- Please select a user --</option>
            </template>
          </b-form-select>
        </b-col>
      </b-row>
    </b-modal>

    <b-table caption-top :items="roleUserList" :fields="fields" :filter="filter">
      <template slot="actions" slot-scope="data">
        <b-button variant="danger" @click="setDel(data.item.role)" v-b-modal.modal-del>Del</b-button>
      </template>
    </b-table>

    <b-modal
      id="modal-del"
      ok-title="Del"
      ok-variant="danger"
      title="Delete role for user"
      @ok="del"
    >
      <b-row class="my-1">
        <b-col sm="2">
          <label for="input-default">User:</label>
        </b-col>
        <b-col sm="10">
          <b-form-select v-model="delRoleUser.user" :options="delUserOptions" class="mb-3">
            <!-- This slot appears above the options from 'options' prop -->
            <template slot="first">
              <option :value="null" disabled>-- Please select a user --</option>
            </template>
          </b-form-select>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Rolelist",
  components: {},
  data() {
    return {
      delRoleUser: {
        role: "",
        user: ""
      },
      addRoleUser: {
        role: "",
        user: ""
      },
      fields: [
        {
          key: "role",
          label: "Role",
          sortable: true
        },
        {
          key: "users",
          label: "Users",
          sortable: true,
          formatter: value => {
            return this.formatUserList(value);
          }
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      roleUserList: [],
      roleList: [],
      userOptions: [],
      roleOptions: [],
      delUserOptions: [],
      userIDName: null,
      userNameID: null,
      filter: null
    };
  },
  created() {
    this.userIDName = new Map();
    this.userNameID = new Map();
    axios
      .get("/v1/user/list", {
        headers: {
          Authorization: localStorage.getItem("access_token")
        }
      })
      .then(response => {
        console.log(response.data);
        response.data.data.forEach(element => {
          this.userOptions.push({
            value: element.id,
            text: element.name
          });
          this.userIDName.set(element.id, element.name);
          this.userNameID.set(element.name, element.id);
        });
        axios
          .get("/v1/ac/role", {
            headers: {
              Authorization: localStorage.getItem("access_token")
            }
          })
          .then(response => {
            console.log(response.data);
            response.data.data.forEach(element => {
              this.roleOptions.push({
                value: element,
                text: element
              });
            });
            axios
              .get("/v1/ac/role/user", {
                headers: {
                  Authorization: localStorage.getItem("access_token")
                }
              })
              .then(response => {
                console.log(response.data);
                this.roleUserList = response.data.data;
              })
              .catch(error => {
                alert(error.response.data.message);
                this.$router.push("/");
              });
          })
          .catch(error => {
            alert(error.response.data.message);
            this.$router.push("/");
          });
      })
      .catch(error => {
        alert(error.response.data.message);
        this.$router.push("/");
      });
  },
  methods: {
    del: function() {
      axios
        .delete("/v1/ac/role/user", {
          data: {
            role: this.delRoleUser.role,
            users: [this.delRoleUser.user]
          },
          headers: {
            Authorization: localStorage.getItem("access_token")
          }
        })
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
          "/v1/ac/role/user",
          {
            role: this.addRoleUser.role,
            users: [this.addRoleUser.user]
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
        .get("/v1/ac/role/user", {
          headers: {
            Authorization: localStorage.getItem("access_token")
          }
        })
        .then(response => {
          console.log(response.data);
          this.roleUserList = response.data.data;
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    },
    setDel: function(data) {
      this.delRoleUser.role = data;
      this.delUserOptions = [];
      this.roleUserList.forEach(value => {
        if (value.role === data) {
          value.users.forEach(value => {
            this.delUserOptions.push({
              value: value,
              text: this.userIDName.get(value)
            });
          });
        }
      });
    },
    formatUserList: function(data) {
      return data.map(element => {
        if (element != "0") {
          return this.userIDName.get(element);
        } else {
          return "";
        }
      });
    }
  },
  computed: {}
};
</script>

<style>
.rolelist {
  text-align: left;
}
</style>
