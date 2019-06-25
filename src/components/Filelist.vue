<template>
  <div class="filelist">
    <b-row>
      <b-col cols="4" class="my-1">
        <b-form-group label-cols-sm="2" label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to filter"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="4" class="my-1">
        <b-form-group label-cols-sm="2" label="Search" class="mb-0">
          <b-input-group>
            <b-form-input placeholder="Type to search"></b-form-input>
            <b-input-group-append>
              <b-button>Search</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="2" class="my-1">
        <b-button v-b-modal.modal-newfolder>New Folder</b-button>
      </b-col>
      <b-col cols="2" class="my-1">
        <b-button v-b-modal.modal-upload>Upload File</b-button>
      </b-col>
    </b-row>

    <b-modal id="modal-newfolder" title="New folder" @hidden="resetModal" @ok="handleNewFolder">
      <b-row>
        <b-col>
          <b-form-input v-model="folderName" placeholder="Enter folder name"></b-form-input>
        </b-col>
      </b-row>
    </b-modal>

    <b-modal id="modal-upload" title="Upload">
      <vue-dropzone
        ref="myVueDropzone"
        id="dropzone"
        @vdropzone-success="vsuccess"
        :options="dropzoneOptions"
      ></vue-dropzone>
    </b-modal>

    <b-table
      caption-top
      :items="files"
      :fields="fields"
      :filter="filter"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template slot="name" slot-scope="data">
        <font-awesome-icon
          v-if="data.item.type === 'dir' && data.item.name!='..'"
          :icon="faFolder"
        />
        <font-awesome-icon v-else-if="data.item.type === 'file'" :icon="faFile"/>
        <a
          v-if="data.item.type === 'dir'"
          href="#"
          @click="toPath(data.item.name)"
        >&nbsp;{{ data.item.name }}</a>
        <a v-else-if="data.item.type === 'file'">&nbsp;{{ data.item.name }}</a>
      </template>
      <template slot="size" slot-scope="data">
        <!-- `data.value` is the value after formatted by the Formatter -->
        <a v-if="data.item.name === '..'"></a>
        <a v-else>{{ data.value }}</a>
      </template>
      <template slot="mtime" slot-scope="data">
        <!-- `data.value` is the value after formatted by the Formatter -->
        <a v-if="data.item.name === '..'"></a>
        <a v-else>{{ data.value }}</a>
      </template>
      <template slot="actions" slot-scope="data">
        <b-row>
          <b-col v-if="data.item.type != 'dir'" cols="4">
            <b-button @click="download(data.item.name)">
              <font-awesome-icon :icon="faDownload"/>
            </b-button>
          </b-col>
          <b-col cols="4">
            <b-button
              v-if="data.item.name != '..'"
              variant="danger"
              @click="setDel(data.item.name)"
              v-b-modal.model-del
            >
              <font-awesome-icon :icon="faTrashAlt"/>
            </b-button>
          </b-col>
        </b-row>
      </template>
      <template slot="table-caption">
        <b-breadcrumb :items="breads"></b-breadcrumb>
      </template>
    </b-table>

    <b-modal
      id="model-del"
      title="Are you sure you want to delete?"
      @hidden="resetModal"
      @ok="handleDel"
    ></b-modal>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faFolder,
  faFile,
  faTrashAlt,
  faDownload
} from "@fortawesome/free-solid-svg-icons";

export default {
  name: "Filelist",
  components: {
    FontAwesomeIcon: FontAwesomeIcon,
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
      faFolder: faFolder,
      faFile: faFile,
      faTrashAlt: faTrashAlt,
      faDownload: faDownload,
      apiHost: process.env.VUE_APP_API_HOST,
      dropzoneOptions: {
        url: "",
        thumbnailWidth: 150,
        maxFilesize: 100,
        withCredentials: false,
        headers: { Authorization: localStorage.getItem("access_token") }
      },
      sortBy: "name",
      sortDesc: false,
      fields: [
        {
          key: "name",
          label: "Name",
          sortable: true
        },
        {
          key: "size",
          label: "Size",
          sortable: true,
          formatter: value => {
            return this.formatFileSize(value);
          }
        },
        {
          key: "mtime",
          label: "Mod Time",
          sortable: true,
          formatter: value => {
            return this.formatTime(value);
          }
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      delFile: "",
      folderName: "",
      files: [],
      breads: [],
      currentPath: "",
      pathStack: [],
      filter: null
    };
  },
  created() {
    axios
      .get("/v1/fs/", {
        params: {
          op: "info"
        },
        headers: {
          Authorization: localStorage.getItem("access_token")
        }
      })
      .then(response => {
        console.log(response.data);
        this.files = response.data.data;
        this.dropzoneOptions.url = response.request.responseURL;
      })
      .catch(error => {
        alert(error.response.data.message);
        console.log(error.response.data);
        if (error.response.data.status === -2) {
          localStorage.clear("access_token");
          this.$router.push("/");
          this.$store.commit("initStatus");
        }
      });
  },
  methods: {
    toPath: function(path) {
      if (this.currentPath === path) {
        path = "";
      }
      console.log("cpath", this.currentPath);
      console.log("path", path);
      axios
        .get("/v1/fs/" + this.currentPath + path, {
          params: {
            op: "info"
          },
          headers: {
            Authorization: localStorage.getItem("access_token")
          }
        })
        .then(response => {
          if (path === "..") {
            this.pathStack.pop();
            this.breads.pop();
            this.files = response.data.data;
            if (this.pathStack.length === 0) {
              this.currentPath = "";
            } else {
              this.currentPath = this.pathStack[this.pathStack.length - 1];
              var back = {
                name: "..",
                path: this.pathStack[this.pathStack.length - 2],
                type: "dir"
              };
              this.files.unshift(back);
            }
          } else if (path === "") {
            this.files = response.data.data;
            if (this.currentPath != "") {
              back = {
                name: "..",
                path: backPath,
                type: "dir"
              };
              this.files.unshift(back);
            }
          } else {
            var backPath = this.currentPath;
            this.currentPath += path + "/";
            this.pathStack.push(this.currentPath);
            this.breads.push({
              text: path,
              disabled: true
            });
            this.files = response.data.data;
            back = {
              name: "..",
              path: backPath,
              type: "dir"
            };
            this.files.unshift(back);
          }
          this.dropzoneOptions.url = response.request.responseURL;
        })
        .catch(error => {
          alert(error.response.data.message);
          if (error.response.data.status === -2) {
            localStorage.clear("access_token");
            this.$router.push("/");
            this.$store.commit("initStatus");
          }
        });
    },
    vsuccess() {
      this.toPath(this.currentPath);
    },
    download: function(file) {
      axios
        .get("/v1/fs/" + this.currentPath + file, {
          headers: {
            Authorization: localStorage.getItem("access_token")
          }
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", file);
          document.body.appendChild(link);
          link.click();
        })
        .catch(error => {
          alert(error.response.data.message);
          if (error.response.data.status === -2) {
            localStorage.clear("access_token");
            this.$router.push("/");
            this.$store.commit("initStatus");
          }
        });
    },
    handleDel: function() {
      axios
        .delete("/v1/fs/" + this.currentPath + this.delFile, {
          headers: {
            Authorization: localStorage.getItem("access_token")
          }
        })
        .then(response => {
          console.log(response.data);
          this.delFile = "";
          this.toPath(this.currentPath);
        })
        .catch(error => {
          alert(error.response.data.message);
          if (error.response.data.status === -2) {
            localStorage.clear("access_token");
            this.$router.push("/");
            this.$store.commit("initStatus");
          }
        });
    },
    handleNewFolder: function() {
      axios
        .post(
          "/v1/fs/" + this.currentPath + this.folderName,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("access_token")
            }
          }
        )
        .then(response => {
          console.log(response.data);
          this.toPath(this.currentPath);
        })
        .catch(error => {
          alert(error.response.data.message);
          if (error.response.data.status === -2) {
            localStorage.clear("access_token");
            this.$router.push("/");
            this.$store.commit("initStatus");
          }
        });
    },
    resetModal: function() {
      this.delFile = "";
      this.folderName = "";
    },
    setDel: function(file) {
      this.delFile = file;
    },
    formatFileSize: function(bytes) {
      if (bytes == 0) return "0 Bytes";
      var k = 1000,
        dm = 2,
        sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    formatTime: function(time) {
      return moment(time)
        .locale("zh-TW")
        .format("MMMM Do YYYY, k:mm:ss");
    }
  },
  computed: {}
};
</script>

<style>
.filelist {
  text-align: left;
}
</style>
