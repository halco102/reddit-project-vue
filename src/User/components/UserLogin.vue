<template>
  <div class="flex flex-col gap-6">

    <!--Email or username-->
    <InputField type="text" :modelValue="emailOrUsername" :name="'usernameOrUsername'" placeholder="Username or email"
      label="Username or email" @update:model-value="(newValue : string) => (emailOrUsername = newValue)"
      :error="v$.emailOrUsername.$error" :errorText="v$.emailOrUsername.$errors[0]?.$message?.toString()" />

    <!--Password-->
    <InputField type="password" :modelValue="password" :name="'password'" placeholder="Password" label="Password"
      @update:model-value="(newValue : string) => (password = newValue)" :error="v$.password.$error"
      :errorText="v$.password.$errors[0]?.$message?.toString()" />

    <ButtonComponent title="Log in" :disabled="false" @onClick="loginUserToApp" />

  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";

//pinia
import { mapActions, mapState } from "pinia";


//types
import { useAuthenticationStore } from "../store/authentication_store";

import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

import InputField from '@/components/InputField.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

let id = null;

export default defineComponent({
  name: "UserLoginForm",
  components: {
    InputField,
    ButtonComponent
  },
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  methods: {
    ...mapActions(useAuthenticationStore, ["loginUser",]),

    loginUserToApp: function (): void {

      this.v$.$validate();

      if (!this.v$.$invalid)
        this.loginUser({
          emailOrUsername: this.emailOrUsername,
          password: this.password
        })
    },

    closeEvent: function () {
      this.$emit("close", this.getSuccessfullLogin);
    },
  },
  watch: {
    getIsLoginLoading: function (value: boolean) {
      this.disableButton = value;
    },
    getSuccessfullLogin: function (value: boolean) {
      if (value) {
        this.closeEvent();
      }
    }
  },
  computed: {
    ...mapState(useAuthenticationStore, ["getIsLoginLoading", 'getSuccessfullLogin']),
  },
  data() {

    return {
      emailOrUsername: '' as string,
      password: '' as string,
      disableButton: false as boolean
    };
  },
  validations() {
    return {
      emailOrUsername: { required },
      password: {
        required,
        minLength: minLength(8)
      }
    }
  },
  beforeMount() {
    id = uuidv4();
  },
});
</script>

