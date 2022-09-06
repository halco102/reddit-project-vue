<template>

  <!--Main div-->
  <div class="grid justify-center mt-10" :class="enlargeImage ? 'enlarge-image' : ''" ref="request">

    <h3 class="font-bold text-center">Upload a post</h3>

    <!--Card div-->
    <div class="my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg">
      <div>
        <!--Form-->
        <Form @submit="onSubmit" :validation-schema="schema" class="p-6">
          <!--Title-->
          <div class="mb-6">
            <Field name="title" v-slot="{ field, meta }">
              <label for="insertText" class="block text-center">Title</label>
              <input v-bind="field" :class="
                !meta.touched || meta.valid
                  ? 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5'
                  : 'bg-gray-50 border text-gray-900 text-sm rounded-lg outline-red-500 border-red-500 block w-full p-2.5 mb-1'
              " placeholder="Title" />
            </Field>
            <ErrorMessage name="title" class="block text-center" />
          </div>

          <!--Description-->
          <div class="mb-6">
            <Field name="text" v-slot="{ field, meta }">
              <label for="insertText" class="block text-center">Description</label>
              <input v-bind="field" :class="
                !meta.touched || meta.valid
                  ? 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5'
                  : 'bg-gray-50 border text-gray-900 text-sm rounded-lg outline-red-500 border-red-500 block w-full p-2.5 mb-1'
              " placeholder="Description" />
            </Field>
            <ErrorMessage name="text" class="block text-center" />
          </div>



          <!--Upload file-->
          <div class="mb-6 grid justify-end">
            <hr class="my-2">
            <Field name="upload">
              <label for="formFile" class="text-center mb-3">Upload image</label>
              <input class="form-control" type="file" id="formFile" ref="fileUpload" @change="onChangeInput" />
            </Field>
            <ErrorMessage name="upload" class="block text-center" />
            <hr class="my-2">
          </div>

          <!--Preview image-->
          <div class="preview" v-if="preview">
            <vue-final-modal v-model="enlargeImage" classes="modal-container" content-class="modal-content">
              <img @click="enlargeImageFunction" class="" :src="preview" />
            </vue-final-modal>
            <img @click="enlargeImageFunction" class="" :src="preview" />
          </div>

          <!--Text area for image url-->
          <div class="mb-6">
            <fieldset :disabled="isDisabled">              
              <Field name="imageUrl" v-slot="{ field, meta }">
                <label for="imageUrl" class="block text-center">Image url</label>
                <input v-bind="field" :class="
                  !meta.touched || meta.valid
                    ? 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5'
                    : 'bg-gray-50 border text-gray-900 text-sm rounded-lg outline-red-500 border-red-500 block w-full p-2.5 mb-1'
                " placeholder="Image url" />
              </Field>

              <ErrorMessage name="imageUrl" />
            </fieldset>
          </div>

          <!-- Categories -->
          <Multiselect v-model="categoryOptions" :options="getAllCategories.map(i => i.name)" mode="tags"
            placeholder="Select categories" :close-on-select="false" :searchable="true" />
          <ErrorMessage name="categoryOptions" class="block text-center" />


          <!--Checkbox for comments-->
          <div class="my-6">
            <div class="mb-3">
              <div class="text-center">
                <input class="w-4 h-4" type="checkbox" id="allowCommentsCheck" v-model="isAllowedComment" />
              </div>
              <label class="text-center text-sm block" for="allowCommentsCheck">
                Allow comments
              </label>
            </div>
          </div>

          <button
            :class="getIsLoading ? 'btn btn-blue disabled m-auto block' : 'btn btn-blue m-auto block'">Submit</button>
        </Form>

        <!--Loading circle-->
        <div class="clearfix" v-show="getIsLoading">
          <div class="spinner-border float-end text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";

//pinia
import { useAuthenticationStore } from "@/User/store/authentication_store";
import { usePostStore } from "@/Post/store/store";
import { mapState, mapActions } from "pinia";
import { useCategoryStore } from "../store/category-store";


//toast
import { useToast } from "vue-toastification";

//vee validate
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

import Multiselect from '@vueform/multiselect'

//types
import { PostRequest } from "../types";
import { SingleCategory } from "../category-types";



export default defineComponent({
  name: "PostRequest",
  components: {
    Field,
    Form,
    ErrorMessage,
    Multiselect
  },
  data() {
    const schema = yup.object().shape({
      categoryOptions: yup.array().test('check-if-value-is-empty', 'No category selected', () => {

        if (this.categoryOptions.length > 0) {
          return true;
        }
        return false;
      }),
      title: yup.string().required("Title is required"),
      text: yup.string().optional().default("").max(255),
      imageUrl: yup
        .string()
        .notRequired()
        .matches(
          /^$|\s+|(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#]*\.(?:jpg|gif|png|wpeg|jpeg))(?:\?([^#]*))?(?:#(.*))?/,
          "url does not end with jpg,gif,png,wpeg or jpeg"
        ),
      upload: yup
        .mixed()
        .test("is-correnct-file", "The file is too big", () => {
          let temp = this.locationOfFile as unknown as HTMLInputElement;

          if (temp != null) {
            if (temp.size > 25097152) {
              return false;
            }
          }

          return true;
        })
        .optional()
        .when("imageUrl", {
          is: (value: string) => {
            if (value?.length === 0 || value == "undefined") {
              return true;
            }
            return false;
          },
          then: (rule: any) =>
            rule.required("Image url is empty, upload image instead."),
        }),
    });

    return {
      schema,
      locationOfFile: null as File | null,
      isDisabled: false,
      imageUrl: "",
      isAllowedComment: false,
      disableButton: false,
      preview: '',
      enlargeImage: false,
      categoryOptions: []
    };
  },
  computed: {
    ...mapState(useAuthenticationStore, ["getCurrentlyLoggedUserProfile"]),
    ...mapState(usePostStore, ["getIsLoading"]),
    ...mapState(useCategoryStore, ['getAllCategories'])
  },
  setup() {
    const toast = useToast();

    return { toast };
  },
  methods: {
    ...mapActions(usePostStore, ["savePost"]),
    ...mapActions(useCategoryStore, ['fetchAllCategories']),
    isRequired: function (value: string): boolean | string {
      return value ? true : "This field is required";
    },
    onSubmit(values: PostRequest | any) {

      values.allowComments = this.isAllowedComment;

      let categoriesObjects = this.findCategoryObjectByName(this.categoryOptions);

      values.categories = categoriesObjects;

      if (this.getCurrentlyLoggedUserProfile.id !== 0) {
        this.savePost(values, this.locationOfFile);
      } else {
        this.toast.warning("Sign in to post");
        return;
      }
    },
    onChangeInput: function (event: any): void {
      let temp: HTMLInputElement = event.target;
      this.locationOfFile = temp.files![0];
      console.log("file", this.locationOfFile);
      this.isDisabled = true;

      //for preview
      this.preview = URL.createObjectURL(this.locationOfFile);
      console.log("Preview", this.preview);
    },
    enlargeImageFunction: function () {
      this.enlargeImage = !this.enlargeImage;
    },
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
    }
  },
  watch: {
    getIsLoading: function (val: boolean): void {
      if (!val) {
        this.$router.push('/');
      }
    },
  },
  mounted() {
    this.fetchAllCategories();
  },
});
</script>



<style scoped>
@import "@vueform/multiselect/themes/default.css";


.form-color-error {
  background-color: #fddfe2;
  color: #f23648;
}

span {
  color: #f23648;
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
  margin-left: 10%;
  margin-right: 10%
}

.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
