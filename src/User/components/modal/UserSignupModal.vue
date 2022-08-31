<template>
  <div class="signup-modal">
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <h3 class="mb-3 font-sans font-bold">Signup</h3>
      <UserSignup @signedUp="isUserSignedUp"/>
    </vue-final-modal>
    <button class="btn btn-blue" @click="showModal = true">Signup</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserSignup from "@/User/components/UserSignup.vue";

export default defineComponent({
  name: "UserSignupModal",
  components: {
    UserSignup,
  },
  data(){
    return{
      showModal: false
    }
  },
  methods: {
    isUserSignedUp: function(value : boolean) : void {
      this.showModal = !value;
    }
  }
});
</script>


<style scoped>
signup-modal {
  padding: 20px;
}


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
