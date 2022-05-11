<template>
  <div class="main-signup-div">
    <form>
      <div class="mb-3">
        <label :for="this.id" class="form-label">Username</label>
        <input
          type="username"
          class="form-control"
          :id="this.id"
          aria-describedby="signupUsernameHelp"
          v-model="username"
        />
        <p v-if="!usernameLength(username)" style="margin-top: 2px">
          Username has to be minimum 5 characters long
        </p>
      </div>
      <div class="mb-3">
        <label :for="this.id" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          :id="this.id + 'signupEmail'"
          aria-describedby="signupEmailHelp"
          v-model="email"
        />
        <div id="signupEmailHelp" class="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      <div class="mb-3">
        <label :for="this.id" class="form-label"
          >Repeat email address</label
        >
        <input
          type="email"
          class="form-control"
          :id="this.id + 'repeatEmail'"
          aria-describedby="signupEmailHelp"
          v-model="repeatEmail"
        />
        <p v-if="!emailMatch(email, repeatEmail)">Email does not match</p>
      </div>
      <div class="mb-3">
        <label :for="this.id" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          :id="this.id + 'password'"
          v-model="password"
        />
        <p v-if="!passwordLengthGreater(password)">
          Password has to be atleast 8 characters long
        </p>
      </div>
      <div class="mb-3">
        <label :for="this.id" class="form-label"
          >Repeat password</label
        >
        <input
          type="password"
          class="form-control"
          :id="this.id + 'repeatPassword'"
          v-model="repeatPassword"
        />
        <p v-if="!passwordMatch(password, repeatPassword)">
          Password does not match
        </p>
      </div>
      <button
        type="submit"
        :class="[
          submitFormCheck() ? 'btn btn-primary' : 'btn btn-primary disabled',
        ]"
        @click.prevent="
          signupUser({
            username: this.username,
            email: email,
            password: password,
          })
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
import { v4 as uuidv4 } from "uuid";

let id = null;

export default defineComponent({
  name: "UserSignupForm",
  components: {},
  expose: ["closePopUp"],
  methods: {
    ...mapActions(useUserStore, ["signupUser"]),
    checkRepeatedEmailAndPassword: function (
      password: string,
      repeatPassword: string,
      email: string,
      repeatEmail: string
    ): void {
      console.log(password);
      if (password === repeatPassword && email === repeatEmail) {
        this.signupUser({
          username: this.username,
          email: email,
          password: password,
        });
      }
      return;
    },
    passwordMatch: function (
      password: string,
      repeatPassword: string
    ): boolean {
      if (password === repeatPassword) {
        return (this.isPasswordMatch = true);
      }
      return (this.isPasswordMatch = false);
    },
    passwordLengthGreater: function (password: string): boolean {
      if (password.length >= 8) {
        return (this.isPasswordLengthGreater = true);
      }
      return (this.isPasswordLengthGreater = false);
    },
    emailMatch: function (email: string, repeatEmail: string): boolean {
      if (email === repeatEmail) {
        return (this.isEmailMatch = true);
      }
      return (this.isEmailMatch = false);
    },
    usernameLength: function (username: string): boolean {
      if (username.length >= 5) {
        return (this.isUsernameLengthGreater = true);
      }
      return (this.isUsernameLengthGreater = false);
    },
    submitFormCheck: function (): boolean {
      if (
        this.isEmailMatch &&
        this.isPasswordMatch &&
        this.isPasswordLengthGreater &&
        this.isUsernameLengthGreater
      ) {
        return true;
      }
      return false;
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
      closePopUp: false,

      isEmailMatch: false,
      isPasswordMatch: false,
      isPasswordLengthGreater: false,
      isUsernameLengthGreater: false,

    };
  },
    beforeMount() {
      this.id = uuidv4();
  },
});
</script>

<style scoped>
</style>