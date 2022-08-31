<template>
  <div>
    <Form @submit="onSubmit" :validation-schema="schema">

      <!-- Email or username txt-->
      <div class="mb-6 grid">
        <Field name="emailOrUsername" v-slot="{ field, meta }">
          <label for="inserttEmailOrUsername" class="form-label">Email or username</label>
          <input v-bind="field" :class="
            !meta.touched || meta.valid
              ? 'rounded border-black bg-blue-200'
              : 'grid form-color-error'
          " />
        </Field>
        <ErrorMessage name="emailOrUsername" />
      </div>

      <!--Password txt-->
      <div class="mb-6">
        <Field name="password" v-slot="{ field, meta }">
          <label for="insertPassword" class="form-label">Password</label>
          <input v-bind="field" :class="
            !meta.touched || meta.valid
              ? 'rounded border-black bg-blue-200'
              : 'grid form-color-error'
          " type="password" />
        </Field>
        <ErrorMessage name="password" />
      </div>

      <div class="container text-center">
        <button :class="disableButton ? 'btn-blue btn-disabled' : 'btn-blue btn rounded-md'">Submit</button>
      </div>
    </Form>
    <div class="clearfix" v-show="getIsLoginLoading">
      <div class="spinner-border float-end text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";

//pinia
import { mapActions, mapState } from "pinia";

//validate
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

//types
import { SignInRequest } from '@/User/types';
import { useAuthenticationStore } from "../store/authentication_store";

let id = null;

export default defineComponent({
  name: "UserLoginForm",
  components: {
    Form,
    Field,
    ErrorMessage
  },
  methods: {
    ...mapActions(useAuthenticationStore, ["loginUser",]),
    loginUserMethod: function (siginRequest: SignInRequest) {
      this.loginUser(siginRequest);
    },
    closeEvent: function () {
      this.$emit("close", this.getSuccessfullLogin);
    },
    onSubmit: function (value: SignInRequest | any) {
      console.log("VALUE", value)
      this.loginUser(value);
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
    const schema = yup.object({
      emailOrUsername: yup.string().min(1).max(50).required('Enter a valid email'),
      password: yup.string().min(8).required(),
    });

    return {
      schema,
      disableButton: false
    };
  },
  beforeMount() {
    id = uuidv4();
  },
});
</script>

<style scoped>
.form-color-error {
  background-color: #fddfe2;
  color: #f23648;
}

span {
  color: #f23648;
}

.form-label {
  @apply mr-2 block text-gray-700 text-sm font-bold text-center mb-2
}
</style>
