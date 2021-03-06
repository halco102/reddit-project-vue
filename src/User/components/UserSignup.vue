<template>
  <div class="main-signup-div">
    <Form
      @submit="onSubmit"
      :validation-schema="schema"
    >
      <div class="mb-3">
        <Field name="username" v-slot="{ field, meta }">
          <label :for="id" class="form-label">Username</label>
          <input
            type="username"
            v-bind="field"
            :class="
              !meta.touched || meta.valid
                ? 'form-control'
                : 'form-control form-color-error'
            "
            :id="id"
            aria-describedby="signupUsernameHelp"
          />
        </Field>
        <ErrorMessage name="username" />
      </div>
      <div class="mb-3">
        <Field name="email" v-slot="{ field, meta }">
          <label :for="id" class="form-label">Email address</label>
          <input
            v-bind="field"
            type="email"
            :class="
              !meta.touched || meta.valid
                ? 'form-control'
                : 'form-control form-color-error'
            "
            :id="id + 'signupEmail'"
            aria-describedby="signupEmailHelp"
          />
        </Field>
        <ErrorMessage name="email" />
      </div>
      <div class="mb-3">
        <Field name="repeatEmail" v-slot="{ field, meta }">
          <label :for="id" class="form-label">Repeat email address</label>
          <input
            v-bind="field"
            type="email"
            :class="
              !meta.touched || meta.valid
                ? 'form-control'
                : 'form-control form-color-error'
            "
            :id="id + 'repeatEmail'"
            aria-describedby="signupEmailHelp"
          />
        </Field>
        <ErrorMessage name="repeatEmail" />
      </div>
      <div class="mb-3">
        <Field name="password" v-slot="{ field, meta }">
          <label :for="id" class="form-label">Password</label>
          <input
            v-bind="field"
            type="password"
            :class="
              !meta.touched || meta.valid
                ? 'form-control'
                : 'form-control form-color-error'
            "
            :id="id + 'password'"
          />
          <password-meter :password="field.value" @score="isPasswordWeak"/>
        </Field>
        <ErrorMessage name="password" />
      </div>
      <div class="mb-3">
        <Field name="repeatPassword" v-slot="{ field, meta }">
          <label :for="id" class="form-label">Repeat password</label>
          <input
            v-bind="field"
            type="password"
            :class="
              !meta.touched || meta.valid
                ? 'form-control'
                : 'form-control form-color-error'
            "
            :id="id + 'repeatPassword'"
          />
        </Field>
        <ErrorMessage name="repeatPassword" />
      </div>
      <button :class="!getIsSignupLoading && isPasswordWeak ? 'btn btn-primary' : 'btn btn-primary disabled'" >Submit</button>
    </Form>
    <div class="clearfix" v-show="getIsSignupLoading">
      <div class="spinner-border float-end text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";

//components
import PasswordMeter from 'vue-simple-password-meter';

//validate
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

//pinia
import { useAuthenticationStore } from "@/User/store/authentication_store";
import { mapActions, mapState } from "pinia";

//types
import { SignupRequest } from '@/User/types'


export default defineComponent({
  name: "UserSignupForm",
  components: {
    Form,
    Field,
    ErrorMessage,
    PasswordMeter
  },
  expose: ["closePopUp"],
  methods: {
    ...mapActions(useAuthenticationStore, ["signupUser"]),
    onSubmit: function (value: SignupRequest | any) {
      this.signupUser(value);
    },
    isSuccessfullSignup: function() {
      console.log("check is signed", this.getSuccessfullSignup)
      this.$emit('signedUp', this.getSuccessfullSignup)
    },
    isPasswordWeak: function(value : number) : boolean {
      if (value <= 2) {
        console.log("Weak password")
        return true;
      }
      return false;
    }
  },
  watch: {
    getSuccessfullSignup: function() : void {
      this.isSuccessfullSignup();
    }
  },
  computed: {
    ...mapState(useAuthenticationStore, ["getIsSignupLoading",'getSuccessfullSignup']),
  },
  data() {
    const schema = yup.object({
      username: yup.string().min(8).required('Username has to be 8 characters long'),
      email: yup.string().email('Not a email').required('Email is a required field'),
      repeatEmail: yup
        .string()
        .email()
        .oneOf([yup.ref("email"), null], "Repeated email does not match")
        .required('Repeat email is a required field'),
      password: yup.string().min(8).required('Password is a required field'),
      repeatPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "passwords do not match").required('Repeat password is a required field'), 
    });

    return {
      schema,
      id: "",
    };
  },
  beforeMount() {
    this.id = uuidv4();
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