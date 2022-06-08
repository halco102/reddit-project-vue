<template>
  <div>
    <Form @submit="onSubmit" :validation-schema="schema">
      <div class="mb-3">
        <Field name="email" v-slot="{ field, meta }" >
        <label for="inserEmail" class="form-label">Email</label>
        <input
          v-bind="field"
          :class="
            !meta.touched || meta.valid
              ? 'form-control'
              : 'form-control form-color-error'
          "
        />
        </Field>
        <ErrorMessage name="email"/>
      </div>
      <div class="mb-3">
        <Field name="password" v-slot="{ field, meta }" >
        <label for="insertPassword" class="form-label">Password</label>
        <input
          v-bind="field"
          :class="
            !meta.touched || meta.valid
              ? 'form-control'
              : 'form-control form-color-error'
          "
          type="password"
        />
        </Field>
        <ErrorMessage name="password"/>
      </div>

      <button :class="disableButton ? 'btn btn-primary disabled':'btn btn-primary'">Submit</button>
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
import { useUserStore } from "@/User/store/store";
import { mapActions, mapState } from "pinia";

//validate
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

//types
import { SignInRequest } from '@/User/types';

let id = null;

export default defineComponent({
  name: "UserLoginForm",
  components: {
    Form,
    Field,
    ErrorMessage
  },
  methods: {
    ...mapActions(useUserStore, ["loginUser", "stopLoadingAnimation",]),
    loginUserMethod: function (siginRequest: SignInRequest) {
      console.log("Login user to app", siginRequest);
      this.loginUser(siginRequest);
    },
    closeEvent: function () {
      this.$emit("close", this.getSuccessfullLogin);
    },
    onSubmit: function(value : SignInRequest | any) {
      this.loginUser(value);
    },
  },
  watch: {
    getIsLoginLoading: function (value: boolean) {
      this.disableButton = value;
    },
    getSuccessfullLogin: function(value : boolean) {
      if (value) {
        this.closeEvent();
      }
    }
  },
  computed: {
    ...mapState(useUserStore, ["getIsLoginLoading", "getUserLogin", 'getSuccessfullLogin']),
  },
  data() {
    const schema = yup.object({
      email: yup.string().required(),
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
</style>