<template>

  <div>

    <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
      <h3 class="mb-3 font-sans font-bold">Login</h3>
      <UserLogin />
    </vue-final-modal>

    <ButtonComponent :disabled="false" @onClick="openLoginModal" title="Login" class="w-[84px]" />

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserLogin from "@/User/components/UserLogin.vue";
import { useAuthenticationStore } from "@/User/store/authentication_store";
import { mapState } from "pinia";
import ButtonComponent from "@/components/ButtonComponent.vue";

export default defineComponent({
  name: "UserLoginModal",
  components: {
    UserLogin,
    ButtonComponent
  },
  computed: {
    ...mapState(useAuthenticationStore, ["userLoginResponse"]),
  },
  methods: {
    openLoginModal: function (): void {
      this.showModal = !this.showModal;
      this.keepDropDownOpen();
    },
    keepDropDownOpen: function (): void {
      this.$emit('open', this.showModal);
    }
  },
  data() {
    return {
      showModal: false
    }
  },
  updated() {
    this.keepDropDownOpen();
  }
});
</script>

<style scoped>
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