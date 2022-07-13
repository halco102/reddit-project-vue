<template>

    <div class="main-modal">

        <vue-final-modal v-model="toShow" classes="modal-container" content-class="modal-content">
            <UpdatePost :post="post" />
        </vue-final-modal>


    </div>

</template>

<script lang="ts">

//vue
import { defineComponent } from "vue";

//pinia
import { usePostStore } from "@/Post/store/store";
import { mapActions, mapState } from "pinia";

//type
import { UserPosts } from "@/Post/types";

//components
import UpdatePost from '@/Post/components/UpdatePost.vue'

export default defineComponent({

    name: 'UpdatePostModal',
    components: {
        UpdatePost
    },
    methods: {
        ...mapActions(usePostStore, []),
        closeModal: function (value: boolean): void {
           this.toShow = !this.toShow;
        }
    },
    computed: {

    }, props: {
        post: Object as () => UserPosts,
        showModal: {
            type: Boolean,
            required: true
        }
    },
    data(){
        return{
            toShow: false
        }
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
    margin-left: 23%;
    margin-right: 24.2%
}

.modal__title {
    font-size: 1.5rem;
    font-weight: 700;
}
</style>