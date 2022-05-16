<template>
  <div class="link-to-login">
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#loginModal"
    >
      Login
    </button>
    <div 
      class="modal fade"
      id="loginModal"
      tabindex="-1"
      aria-labelledby="loginModal2"
      aria-hidden="true"
      ref="loginModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Login</h5>
            <button
              id="closeModal"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <UserLogin @close = "closeModal"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserLogin from "../UserLogin.vue";
import { useUserStore } from "../../store/UserStore";
import { mapState } from "pinia";

export default defineComponent({
  name: "UserLoginModal",
  components: {
    UserLogin,
  },
  computed: {
    ...mapState(useUserStore, ["userLoginResponse"]),
  },
  methods: {
    closeModal: function (value : boolean): void {
      if (value) {
        document.getElementById('closeModal')!.click();
      }
    },
  },
  data() {
    return {
      isClose: false,
    };
  },
});
</script>

<style scoped>
</style>