<template>
  <div class="filelist">
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to filter"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Search" class="mb-0">
          <b-input-group>
            <b-form-input placeholder="Type to search"></b-form-input>
            <b-input-group-append>
              <b-button>Search</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row align-h="end">
      <b-col cols="auto" class="p-auto">
        <b-button v-b-modal.modal-1>Upload</b-button>
      </b-col>
    </b-row>

    <b-modal id="modal-1" title="Upload">
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
        <a
          v-if="data.item.type === 'dir'"
          href="#"
          @click="toPath(data.item.name)"
        >{{ data.item.name }}</a>
        <a v-else>{{ data.item.name }}</a>
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
          <b-col cols=3>
            <b-button v-if="data.item.type != 'dir'" @click="download(data.item.name)">Download</b-button>
          </b-col>
          <b-col cols=3>
            <b-button variant="danger" @click="setDel(data.item.name)" v-b-modal.modal-2>Del</b-button>
          </b-col>
        </b-row>
      </template>
      <template slot="table-caption">
        <b-breadcrumb :items="breads"></b-breadcrumb>
      </template>
    </b-table>

    <b-modal id="modal-2" title="Are you sure you want to delete?" @ok="handleDel"></b-modal>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  name: "Filelist",
  components: {
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
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
        this.$router.push("/");
      });
  },
  methods: {
    toPath: function(path) {
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
        });
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
