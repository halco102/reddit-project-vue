<template>
        
       <div class="signup-modal">
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Sign up
        </button>

        
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          ref="signupModal"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Signup</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <UserSignup />
              </div>
            </div>
          </div>
        </div>
        </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserSignup from '../UserSignup.vue'

export default defineComponent({
  name: 'UserSignupModal',
  components:{
    UserSignup
  }
})
</script>


<style scoped>
signup-modal{
  padding:20px;
}

</style>
