<template>
  <div class="main" ref="request">
    <NavigationBar />
    <div class="post-card">
      <h3>Upload a post</h3>
      <div class="card" style="width: 35rem">
        <div class="card-body">
          <form
            v-on:submit.prevent="
              savePostMethod(
                {
                  title: titleData,
                  text: textData,
                  imageUrl: imageUrlData,
                  allowComments: allowCommentsData,
                },
                locationOfFile
              )
            "
          >
            <div class="mb-3">
              <label for="insertTitle" class="form-label">Title</label>
              <input
                type="text"
                class="form-control"
                v-model="titleData"
                placeholder="255 characters"
              />
            </div>

            <div class="mb-3">
              <label for="insertText" class="form-label">Text</label>
              <input
                type="text"
                class="form-control"
                v-model="textData"
                placeholder="255 characters"
              />
            </div>

            <div class="mb-3">
              <label for="formFile" class="form-label"
                >Upload image</label
              >
              <input
                class="form-control"
                type="file"
                id="formFile"
                ref="fileUpload"
                @change="onChangeInput"
              />
            </div>

            <div class="mb-3">
              <label for="insertImage" class="form-label">Image url</label>
              <input
                type="text"
                class="form-control"
                v-model="imageUrlData"
                placeholder="255 characters"
              />
            </div>

            <div class="comment-checkbox-button">
              <div class="mb-3">
                <div class="form-check allign">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="allowCommentsCheck"
                    v-model="allowCommentsData"
                  />
                </div>
                <label class="form-check-label" for="allowCommentsCheck">
                  Allow comments
                </label>
              </div>

              <button type="submit" class="btn btn-primary">Post</button>
            </div>
          </form>

          <div class="clearfix" v-show="isLoading">
            <div class="spinner-border float-end text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "../store/UserStore";
import { usePostStore , PostRequest} from "../store/PostStore";
import { mapState, mapActions } from "pinia";
import NavigationBar from "./NavigationBar.vue";


export default defineComponent({
  name: "PostRequest",
  components: {
    NavigationBar,
  },
  computed: {
    ...mapState(useUserStore, ["user"]),
    ...mapState(usePostStore, ["isLoading"]),
  },
  methods: {
    ...mapActions(usePostStore, ["savePost", 'getEvent', 'openWebsocket','closeWebSocket']),
    onChangeInput: function (event: any): void {
      this.locationOfFile = event.target.files[0];
    },
    savePostMethod: function(request: PostRequest, location: string) {
        this.savePost(request, location);
        
        this.$router.push('/');
    }
  },
  data() {
    return {
      titleData: "",
      textData: "",
      imageUrlData: "",
      allowCommentsData: true,
      locationOfFile: null,
    };
  },
  created() {
    console.log("Open ws on post request");
    this.openWebsocket();
  },
  unmounted() {
    console.log("Destroy")
  }
});
</script>

<style scoped>
.main h3 {
  color: wheat;
}
.post-card {
  display: grid;
  justify-content: center;
  margin: 2% 16%;
  padding: 100px;
}
.post-card button {
  width: 100px;
}

.form-check {
  padding: 0px;
}

.allign {
  display: flex;
  justify-content: center;
}

.form-check-input {
  padding: 10px;
  margin-bottom: 4px;
}

::placeholder {
  font-size: 1rem;
  text-align: right;
}

.comment-checkbox-button {
  display: grid;
  justify-content: center;
}
</style>
