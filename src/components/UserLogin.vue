<template>
  <div class="main-user-div">
    <form>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label"  >Email address</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          v-model="email1"
        />
        <div id="emailHelp" class="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label" >Password</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          v-model="password1"
        />
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="loginUser({
        email: this.email1,
        password: this.password1
      })">Submit</button>
    </form>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "../store/UserStore";
import { mapActions, mapState } from "pinia";

export default defineComponent({
  name: 'UserLoginForm',
  components: {},
  methods: {
    ...mapActions(useUserStore, ['loginUser']),
    testMethod: function (exampleCheck1: string) {
      console.log(exampleCheck1);
    },
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  data(){
    return{
      email1: '',
      password1: '',
    }
  },
});
</script>
