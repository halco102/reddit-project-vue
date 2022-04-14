<template>
  <div class="main-signup-div">
    <form>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Username</label>
        <input
          type="username"
          class="form-control"
          id="inputUsername"
          aria-describedby="usernameHelp"
          v-model="username"
        />
        <p v-show="username.length < 8" style="margin-top: 2px">
          Username has to be minimum 8 characters long
        </p>
      </div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="inputEmail"
          aria-describedby="emailHelp"
          v-model="email"
        />
        <div id="emailHelp" class="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label"
          >Repeat email address</label
        >
        <input
          type="email"
          class="form-control"
          id="inputRepeatEmail"
          aria-describedby="emailHelp"
          v-model="repeatEmail"
        />
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="inputPassowrd"
          v-model="password"
        />
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword2" class="form-label"
          >Repeat password</label
        >
        <input
          type="password"
          class="form-control"
          id="inputPassowrd2"
          v-model="repeatPassword"
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary"
        @click.prevent="
          checkRepeatedEmailAndPassword(
            this.password,
            this.repeatPassword,
            this.email,
            this.repeatEmail
          )
        "
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "../store/UserStore";
import { mapActions, mapState } from "pinia";

export default defineComponent({
  name: "UserSignupForm",
  components: {},
  expose:['closePopUp'],
  methods: {
    ...mapActions(useUserStore, ["signupUser"]),
    testMethod: function (exampleCheck1: string) {
      console.log(exampleCheck1);
    },
    checkRepeatedEmailAndPassword: function (
      password: string,
      repeatPassword: string,
      email: string,
      repeatEmail: string
    ): void {
      console.log(password);
      if (password === repeatPassword && email === repeatEmail) {
        const temp = this.signupUser({
          username: this.username,
          email: email,
          password: password,
        });
      }
      return;
    },
  },
  computed: {
    ...mapState(useUserStore, ["user"]),
  },
  data() {
    return {
      username: "",
      email: "",
      repeatEmail: "",
      password: "",
      repeatPassword: "",
      closePopUp: false
    };
  },
});
</script>

<style scoped>
</style>