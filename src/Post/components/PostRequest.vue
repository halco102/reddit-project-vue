<template>
  <div class="main" :class="enlargeImage ? 'enlarge-image' : ''" ref="request">
    <NavigationBar />
    <div class="post-card">
      <h3>Upload a post</h3>
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

            <div class="mb-3">
              <Field name="upload">
                <label for="formFile" class="form-label">Upload image</label>
                <input class="form-control" type="file" id="formFile" ref="fileUpload" @change="onChangeInput" />
              </Field>
              <ErrorMessage name="upload" />
            </div>

            <div class="preview" v-if="preview">
              <vue-final-modal v-model="enlargeImage" classes="modal-container" content-class="modal-content">
                <img @click="enlargeImageFunction" class="enlarge-image" :src="preview" />
              </vue-final-modal>
              <img @click="enlargeImageFunction" class="default-image" :src="preview" />
            </div>

            <div class="mb-3">
              <fieldset :disabled="isDisabled">
                <label for="imageUrl" class="form-label">Image url</label>
                <Field name="imageUrl" class="form-control" />
                <ErrorMessage name="imageUrl" />
              </fieldset>
            </div>

            <!-- Categories -->
            <Multiselect v-model="categoryOptions" :options="getAllCategories.map(i => i.name)" mode="tags"
              placeholder="Select categories" :close-on-select="false" :searchable="true" />
            <ErrorMessage name="categoryOptions" />
            


            <div class="comment-checkbox-button">
              <div class="mb-3">
                <div class="form-check allign">
                  <input class="form-check-input" type="checkbox" id="allowCommentsCheck" v-model="isAllowedComment" />
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
import { defineComponent } from "vue";

//pinia
import { useAuthenticationStore } from "@/User/store/authentication_store";
import { usePostStore } from "@/Post/store/store";
import { mapState, mapActions } from "pinia";
import { useCategoryStore } from "../store/category-store";

//custom components
import NavigationBar from "@/components/NavigationBar.vue";

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
    NavigationBar,
    Field,
    Form,
    ErrorMessage,
    Multiselect
  },
  data() {
    const schema = yup.object().shape({
      categoryOptions: yup.array().test('check-if-value-is-empty', 'No category selected', (val : any) => {

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
            rule.required("Image url is empty, upload image insted."),
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
  }
});
</script>



<style scoped>
@import "@vueform/multiselect/themes/default.css";

.enlarge-image {

  width: 100%;
  height: 100%;

}

.enlarge-image:hover {
  cursor: zoom-out;
}

.default-image {
  max-width: 33rem;
  max-height: 100%;
}

.preview {
  margin-bottom: 1vh;
}

.default-image:hover {
  cursor: zoom-in;
}

.main h3 {
  color: black;
}

.post-card {
  display: grid;
  justify-content: center;
  margin: 2% 16%;
  padding: 100px;
}

.post-card button {
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
