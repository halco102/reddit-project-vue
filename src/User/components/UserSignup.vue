<template>
  <div class="lg:w-max md:w-max sm:w-max h-max p-4 flex flex-col gap-3">

    <!--Username-->
    <InputField type="text" :modelValue="username" name="username" placeholder="Username" label="Username"
      @update:model-value="(newValue : string) => (username = newValue)" :error="v$.username.$error"
      :errorText="v$.username.$errors[0]?.$message?.toString()" />

    <!--Email-->
    <InputField type="text" :modelValue="email" name="email" placeholder="Email" label="Email"
      @update:model-value="(newValue : string) => (email = newValue)" :error="v$.email.$error"
      :errorText="v$.email.$errors[0]?.$message?.toString()" />

    <!--Password-->
    <InputField type="password" :modelValue="password" name="password" placeholder="Password" label="Password"
      @update:model-value="(newValue : string) => (password = newValue)" :error="v$.username.$error" :errorText="v$.password.$errors[0]?.
      $message?.toString()" />

    <!--Confirm password-->
    <InputField type="password" :modelValue="confirmPassword" name="confirmPassword" placeholder="Confirm password"
      label="Confirm password" @update:model-value="(newValue : string) => (confirmPassword = newValue)"
      :error="v$.confirmPassword.$error" :errorText="v$.confirmPassword.$errors[0]?.$message?.toString()" />

    <div class="px-4 grid justify-center">
      <ButtonComponent class="bg-blue-500 mt-7 rounded-lg text-white" :disabled="!!v$.$errors.length"
        title="Create account" @onClick="submitForm" />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";

import { InputType } from '@/components/InputField.vue';

//components
import PasswordMeter from 'vue-simple-password-meter';
import InputField from "@/components/InputField.vue";

import { useVuelidate } from '@vuelidate/core'
import { required, email, sameAs, minValue } from '@vuelidate/validators'
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
