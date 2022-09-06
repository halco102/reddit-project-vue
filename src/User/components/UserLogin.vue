<template>
  <div>
    <Form @submit="onSubmit" :validation-schema="schema">

      <!-- Email or username txt-->
      <div class="mb-6 grid">
        <Field name="emailOrUsername" v-slot="{ field, meta }">
          <label for="inserttEmailOrUsername" class="form-label">Email or username</label>
          <input v-bind="field" :class="
            !meta.touched || meta.valid
              ? 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5'
              : 'bg-gray-50 border text-gray-900 text-sm rounded-lg outline-red-500 border-red-500 block w-full p-2.5 mb-1'
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
              ? 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5'
              : 'bg-gray-50 border text-gray-900 text-sm rounded-lg outline-red-500 border-red-500 block w-full p-2.5 mb-1'
          " type="password" />
        </Field>
        <ErrorMessage name="password" />
      </div>

      <div :class="getIsLoginLoading ? 'flex justify-center relative' : 'container text-center'">
        <button :class="disableButton ? 'btn-blue btn-disabled' : 'btn-blue btn rounded-md'">Submit</button>

        <!--Loading -->
        <div role="status" v-show="getIsLoginLoading" class="mt-1 absolute right-0">
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
    </Form>



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

.form-label {
  @apply mr-2 block text-gray-700 text-sm font-bold text-center mb-2
}
</style>
