<template>
  <div class="main-user-div">
    <form>
      <div class="mb-3">
        <label :for="this.id" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          :id="this.id"
          aria-describedby="emailHelp"
          v-model="email1"
        />
        <div id="loginemailHelp" class="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      <div class="mb-3">
        <label :for="this.id" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          :id="this.id"
          v-model="password1"
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary"
        @click.prevent="
          loginUserMethod({
            email: email1,
            password: password1,
          })
        "
      >
        Submit
      </button>
    </form>
    <div class="clearfix" v-show="getIsLoginLoading">
      <div class="spinner-border float-end text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore, signInRequest } from "../store/UserStore";
import { mapActions, mapState } from "pinia";
import { v4 as uuidv4 } from "uuid";

let id = null;

export default defineComponent({
  name: "UserLoginForm",
  components: {},
  methods: {
    ...mapActions(useUserStore, ["loginUser", "stopLoadingAnimation"]),
    loginUserMethod: function (siginRequest: signInRequest) {
      console.log("Login user to app", siginRequest);
      this.loginUser(siginRequest);
      this.closeEvent(this.getIsLoginLoading);
    },
    closeEvent: function (val: boolean) {
      this.$emit("close", val);
    },
  },
  watch: {
    getIsLoginLoading: function (value: boolean) {
      if (!value) {
        this.closeEvent(!value);
      }
    },
  },
  computed: {
    ...mapState(useUserStore, ["getIsLoginLoading", "userLoginResponse"]),
  },
  data() {
    return {
      email1: "",
      password1: "",
      id: null,
      temp: false,
    };
  },
  beforeMount() {
    id = uuidv4();
  },
});
</script>

<style scoped>
</style>
