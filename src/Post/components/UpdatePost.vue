<template>

    <div class="main">
        <NavigationBarVue />

        <div class="update">
            <h3>Update post</h3>
            <div class="card" style="width: 35rem">

                <div class="card-body">
                    <Form @submit="onSubmit" :validation-schema="schema">
                        <div class="mb-3">
                            <Field name="title" v-slot="{ field, meta }">
                                <label for="insertText" class="form-label">Title</label>
                                <input v-bind="field" :class="
                                    !meta.touched || meta.valid
                                        ? 'form-control'
                                        : 'form-control form-color-error'
                                " />
                            </Field>
                            <ErrorMessage name="title" />
                        </div>
                        <div class="mb-3">
                            <Field name="text" v-slot="{ field, meta }">
                                <label for="insertText" class="form-label">Description</label>
                                <input v-bind="field" :class="
                                    !meta.touched || meta.valid
                                        ? 'form-control'
                                        : 'form-control form-color-error'
                                " />
                            </Field>
                            <ErrorMessage name="text" />
                        </div>



                        <Multiselect v-model="categoryOptions" :options="getAllCategories.map((i) => i.name)"
                            mode="tags" placeholder="Select categories" :close-on-select="false" :searchable="true" />
                        <ErrorMessage name="categoryOptions" />

                        <div class="preview">
                            <img class="default-image" :src="getPostById?.imageUrl" />
                        </div>



                        <div class="comment-checkbox-button">
                            <div class="mb-3">
                                <div class="form-check allign">
                                    <input class="form-check-input" type="checkbox" id="allowCommentsCheck"
                                        v-model="isAllowedComment" />
                                </div>
                                <label class="form-check-label" for="allowCommentsCheck">
                                    Allow comments
                                </label>
                            </div>
                        </div>
                        <button :class="getIsLoading ? 'btn btn-primary disabled' : 'btn btn-primary'">Submit</button>
                    </Form>

                    <div class="clearfix" v-show="getIsLoading">
                        <div class="spinner-border float-end text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    </div>


</template>

<script lang="ts">

//vue
import { defineComponent } from "vue";

//vee validate
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

import Multiselect from '@vueform/multiselect'

//types
import { UpdatePost } from "../types";

//pinia
import { usePostStore } from "../store/store";
import { mapActions, mapState } from "pinia";
import { useCategoryStore } from "../store/category-store";

//components
import NavigationBarVue from '@/components/navigation_bar/NavigationBar.vue';
import { SingleCategory } from "../category-types";



export default defineComponent({
    name: 'UpdatePage',
    components: {
        Field,
        Form,
        ErrorMessage,
        Multiselect,
        NavigationBarVue
    },
    methods: {

        ...mapActions(usePostStore, ['fetchPostById', 'updatePostById']),
        ...mapActions(useCategoryStore, ['fetchAllCategories']),

        findCategoryObjectByName: function (names: string[]): SingleCategory[] {
            let objects = [] as SingleCategory[];
            names.forEach((name) => {
                this.getAllCategories.filter((i) => {
                    if (i.name === name) {
                        objects.push(i);
                    }
                })
            })

            return objects;
        },

        onSubmit: function (val: UpdatePost | any): void {

            if (val.text === undefined) {
                val.text = '';
            }

            val.allowComments = this.isAllowedComment;
            val.categories = this.findCategoryObjectByName(this.categoryOptions);

            this.updatePostById(this.postId, val);

        },

    },
    computed: {
        ...mapState(usePostStore, ['getIsLoading', 'getPostById']),
        ...mapState(useCategoryStore, ['getAllCategories'])
    },
    data() {
        const schema = yup.object().shape({
            categoryOptions: yup.array().test('check-if-value-is-empty', 'No category selected', (val: any) => {

                if (this.categoryOptions.length > 0) {
                    return true;
                }
                return false;
            }),
            title: yup.string().required("Title is required"),
            text: yup.string().optional().default("").max(255),
            isAllowedComment: yup.boolean().default(false).required()
        });

        return {
            schema,
            isAllowedComment: false,
            categoryOptions: [],
            postId: 0
        };
    },
    props: {
        //via router-link only string can be passed
        id: String,
    },
    created() {
        //get post by postId
        this.postId = parseInt(this.id!);
        this.fetchPostById(this.postId);

        this.fetchAllCategories();
    }
});

</script>

<style scoped>
@import "@vueform/multiselect/themes/default.css";


.default-image {
    max-width: 33rem;
    max-height: 100%;
}

.update {
    display: grid;
    justify-content: center;
    margin: 2% 16%;
    padding: 100px;
}

.update button {
    width: 100px;
}

.form-check {
    padding: 0px;
}

.allign {
    display: flex;
    justify-content: center;
}

.form-check-input {
    padding: 10px;
    margin-bottom: 4px;
}

::placeholder {
    font-size: 1rem;
    text-align: right;
}

.comment-checkbox-button {
    margin-top: 1vh;
    display: grid;
    justify-content: center;
}

.form-color-error {
    background-color: #fddfe2;
    color: #f23648;
}

span {
    color: #f23648;
}
</style>