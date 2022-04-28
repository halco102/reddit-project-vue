<template>
  <div class="main">
    <NavigationBar />
    <div class="user-profile-main">
      

      <!-- content -->
      <div class="user-content">
        <p>Content</p>
        <router-link 
        v-for="post in getUserProfile.posts" :key="post.id"
        :to="{name: 'SinglePage', params:{id: post.id }}">
        <div class="content">
          
          <div class="card" style="width: 35rem">
          <img :src="post.imageUrl" />
          <div class="card-body">
            <h5 class="card-title">{{post.title}}</h5>
            <p class="card-text" style = "color:black;">
              {{post.text}}
            </p>
          </div>
        </div>
        </div>
        </router-link>
      </div>

      <!-- user profile -->
      <div class="user-profile">
        <p>Profile</p>
        <div class="card" style="width: 18rem">
          <img :src="getUserProfile.imageUrl" />
          <div class="card-body">
            <h5 class="card-title">{{getUserProfile.username}}</h5>
            <div class="additional-information">
              <p>Email: {{getUserProfile.emai}} </p>
              <p>Created at: {{getUserProfile.createdAt}} </p>
              <p>Sum of post likes: </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationBar from "./NavigationBar.vue";
import { useUserStore, PostedBy } from "../store/UserStore";
import { mapActions, mapState } from "pinia";


export default defineComponent({
  name: "UserProfile",
  components: {
    NavigationBar,
  },
  methods: {
    ...mapActions(useUserStore, ["getUserByIdOrUsername"]),
    getPostedBy: function (): PostedBy {
      console.log("GetPostedBy", this.getUserProfile);
      return {
        id: this.getUserProfile.id,
        username: this.getUserProfile.username,
        imageUrl: this.getUserProfile.imageUrl,
      };
    },
    getNumberOfLikesFromAllPosts: function() : number{
      let likes = 0;
      return likes;
    }
  },
  computed: {
    ...mapState(useUserStore, ["getUserProfile"]),
  },
  created() {
    let convertStringToInt = +this.$route.params.userId;
    this.getUserByIdOrUsername(convertStringToInt, null);
  },
});
</script>

<style scoped>
.main p {
  color: white;
}

.user-profile-main {
  display: flex;
  justify-content: center;
  margin-top: 10vh;
}

.user-content {
  margin-right: 5vh;
  text-align:center;
}

.content{
  margin-bottom:1rem;
}


.user-profile {
  text-align: center;
}

.user-profile img{
  display:block;
  width:100px;
  height:100px;
  margin-left:auto;
  margin-right:auto;
}

.additional-information p{
  color:black;
}
</style>
