<template>
  <div class="bar">
    <button class="btn-local" @click="postOrCommentClicked(1)">Posts</button>
    <button class="btn-local" @click="postOrCommentClicked(2)">Comments</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserProfileBar",
  methods: {

postOrCommentClicked(args : number) : void{

if (args === 1) {
  console.log("Post clicked");
    this.events.isComment = false;
  this.events.isPost = true;
  this.$emit("postOrComment", this.events);
}else{
  console.log("comment clicked");
  this.events.isComment = true;
  this.events.isPost = false;

  console.log("Event to sent", this.events)

  this.$emit("postOrComment", this.events)
}
}
  },
  data() {
    return {

events : {
  isPost: true,
  isComment: false
}
    }
  }
});

</script>

<style scoped>
input[type="submit"]:hover {
  text-decoration: underline;
}

.btn-local {
  border: none;
  background: none;
  color: white;

}

button:hover {
  text-decoration: underline;
  text-decoration-color: rgb(rgb(150, 144, 144), green, blue);
  text-decoration-thickness: 5px;
}


.bar {
  display: flex;
  justify-content: space-around;
  border-style: solid;
  border-color: antiquewhite;
  margin-bottom: 10px;
  padding: 10px;
}

.bar p {
  align-self: center;
}

.bar {
  margin-left: auto;
  margin-right: auto;
}

.bar p {
  color: white;
}
</style>