<template>
  <div class="lg:w-max md:w-max sm:w-max h-max p-4 flex flex-col gap-3">

    <!--Username-->
    <InputField type="text" :modelValue="username" name="username" placeholder="Username" label="Username"
      @update:model-value="(newValue: string) => (username = newValue)" :error="v$.username.$error"
      :errorText="v$.username.$errors[0]?.$message?.toString()" />

    <!--Email-->
    <InputField type="text" :modelValue="email" name="email" placeholder="Email" label="Email"
      @update:model-value="(newValue: string) => (email = newValue)" :error="v$.email.$error"
      :errorText="v$.email.$errors[0]?.$message?.toString()" />

    <!--Password-->
    <InputField type="password" :modelValue="password" name="password" placeholder="Password" label="Password"
      @update:model-value="(newValue: string) => (password = newValue)" :error="v$.username.$error" :errorText="v$.password.$errors[0]?.
      $message?.toString()" />

    <!--Confirm password-->
    <InputField type="password" :modelValue="confirmPassword" name="confirmPassword" placeholder="Confirm password"
      label="Confirm password" @update:model-value="(newValue: string) => (confirmPassword = newValue)"
      :error="v$.confirmPassword.$error" :errorText="v$.confirmPassword.$errors[0]?.$message?.toString()" />

    <div class="px-4 grid justify-center relative">
      <ButtonComponent class="bg-blue-500 mt-7 rounded-lg text-white"
        :disabled="!!v$.$errors.length || getIsSignupLoading" title="Create account" @onClick="submitForm" />

      <!--Loading -->
      <div role="status" v-show="getIsSignupLoading" class="mt-1 absolute right-0 my-auto">
        <svg aria-hidden="true" class="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"></path>
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"></path>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";


//components
import PasswordMeter from 'vue-simple-password-meter';
import InputField from "@/components/InputField.vue";

import { useVuelidate } from '@vuelidate/core'
import { required, email, sameAs } from '@vuelidate/validators'
import ButtonComponent from "@/components/ButtonComponent.vue";



//pinia
import { useAuthenticationStore } from "@/User/store/authentication_store";
import { mapActions, mapState } from "pinia";

//types
import { SignupRequest } from '@/User/types'


export default defineComponent({
  name: "UserSignupForm",
  components: {
    InputField,
    ButtonComponent
  },
  setup() {
    return { v$: useVuelidate() }
  },
  expose: ["closePopUp"],
  validations() {
    return {
      username: {
        required,
      },
      email: {
        required, email
      },
      password: {
        required,
      },
      confirmPassword: {
        sameAsPassword: sameAs(this.password)
      }

    }
  },
  methods: {
    ...mapActions(useAuthenticationStore, ["signupUser"]),
    test: function (): void {
      this.v$.$validate();
      console.log(this.v$.username.$errors);
    },
    onSubmit: function (value: SignupRequest | any) {
      this.signupUser(value);
    },
    isSuccessfullSignup: function () {
      console.log("check is signed", this.getSuccessfullSignup)
      this.$emit('signedUp', this.getSuccessfullSignup)
    },
    isPasswordWeak: function (value: any): void {

      /*
            if (value.score <= 2) {
              this.isPasswordStrong = false;
            } else {
              this.isPasswordStrong = true;
            }
            */

    },
    submitForm: function (): void {
      this.v$.$validate();

      console.log(!!this.v$.$errors.length)
      if (this.v$.$invalid) return
      this.signupUser({
        username: this.username,
        email: this.email,
        password: this.password
      })
    }
  },
  watch: {
    getSuccessfullSignup: function (): void {
      this.isSuccessfullSignup();
    },
    password: function (val: string): void {
      console.log("val", val)
    }
  },
  computed: {
    ...mapState(useAuthenticationStore, ["getIsSignupLoading", 'getSuccessfullSignup']),
  },
  data() {

    return {
      id: '' as string,
      username: '' as string,
      email: '' as string,
      password: '' as string,
      confirmPassword: '' as string
    };
  },
  beforeMount() {
    this.id = uuidv4();
  },
});
</script>
