<template>

  <div class="link-to-login">

    <vue-final-modal v-model="showModal"  classes="modal-container" content-class="modal-content">
      <h3 class="mb-3 font-sans font-bold">Login</h3>
      <UserLogin @close="closeModal"/>
    </vue-final-modal>
    <button class="btn btn-blue" @click="showModal = true">Login</button>


  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserLogin from "@/User/components/UserLogin.vue";
import { useAuthenticationStore } from "@/User/store/authentication_store";
import { mapState } from "pinia";

export default defineComponent({
  name: "UserLoginModal",
  components: {
    UserLogin
  },
  computed: {
    ...mapState(useAuthenticationStore, ["userLoginResponse"]),
  },
  methods: {
    closeModal : function(value : boolean) : void{
      this.showModal = !value;
    }
  },
  data(){
    return {
      showModal: false
    }
  },
});
</script>

<style scoped>

h3{
  text-align:center;
}

::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
  padding: 2rem 5rem;
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>