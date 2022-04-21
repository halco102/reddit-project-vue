<template>
  <div class="main">
    <NavigationBar/>
    <div class="post-card">
      <h3>Upload a post</h3>
      <div class="card" style="width: 35rem">
        <div class="card-body">
          <form
            v-on:submit.prevent="
              savePost({
                title: titleData,
                text: textData,
                imageUrl: imageUrlData,
                allowComments: allowCommentsData,
                userId: user.id,
              })
            "
          >
            <div class="mb-3">
              <label for="insertTitle" class="form-label">Title</label>
              <input type="text" class="form-control" v-model="titleData" placeholder="255 characters"/>
            </div>

            <div class="mb-3">
              <label for="insertText" class="form-label">Text</label>
              <input type="text" class="form-control" v-model="textData" placeholder="255 characters"/>
            </div>

            <div class="mb-3">
              <label for="insertImage" class="form-label">Image url</label>
              <input type="text" class="form-control" v-model="imageUrlData" placeholder="255 characters"/>
            </div>

            <div class="mb-3">
              <div class="form-check">
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
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useUserStore } from "../store/UserStore";
import { usePostStore } from "../store/PostStore";
import { mapState, mapActions } from "pinia";
import NavigationBar from './NavigationBar.vue'

export default defineComponent({
  name: "PostRequest",
  components: {
    NavigationBar
  },
  computed: {
    ...mapState(useUserStore, ["user"]),
  },
  methods: {
    ...mapActions(usePostStore, ["savePost"]),
  },
  data() {
    return {
      titleData: "",
      textData: "",
      imageUrlData: "",
      allowCommentsData: true,
    };
  },
});
</script>

<style scoped>

.main {
  padding-top:20px;
  background-color: rgba(28, 28, 28, 0.9);
  min-height:100%;
  position:absolute;
}

.main h3{
  color:wheat;
}
.post-card{
  display:grid;
  justify-content:center;
  margin:2% 16%;
  padding:100px;
}
.post-card button{
  width: 100px;
}

.form-check{
  display:flex;
  justify-content:center;
}
.form-check-input{
  padding:10px;
  margin-bottom:4px;
}

::placeholder {
  font-size: 1rem;
  text-align: right;
}

</style>
