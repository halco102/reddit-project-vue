<template>
  <!--Main div-->
  <div class="grid justify-center">

    <!--text -->
    <div>
      <h3 class="font-bold text-center">Upload a post</h3>
    </div>

    <!--Title-->
    <InputField type="text" :modelValue="title" name="title" placeholder="Title" label="Title*"
      @update:model-value="(newValue : string) => (title = newValue)" :error="v$.title.$error"
      :errorText="v$.title.$errors[0]?.$message?.toString()" />

    <!--Description-->
    <InputField type="text" :modelValue="description" name="description" placeholder="Description" label="Description"
      @update:model-value="(newValue : string) => (description = newValue)" />


    <div class="mb-6 grid justify-center">
      <label for="formFile" class="text-center mb-3">Upload image</label>
      <input class="" type="file" id="formFile" ref="fileUpload" @change="onChangeInput" />
    </div>

    <InputField type="text" :modelValue="url" name="url" placeholder="Url" label="Url"
      @update:model-value="(newValue : string) => (url = newValue)" :error="v$.url.$error"
      :errorText="v$.url.$errors[0]?.$message?.toString()" :disabled="lockImgUrl" />

    <button @click="test">Click</button>



  </div>

  <!--Main div
  <div class="grid justify-center mt-10" :class="enlargeImage ? 'enlarge-image' : ''" ref="request">

    <h3 class="font-bold text-center">Upload a post</h3>

    <!~~Card div~~>
    <div class="my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg">
      <div>

        <Form @submit="onSubmit" :validation-schema="schema" class="p-6">
          <!~~Title~~>
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

          <!~~Description~~>
          <div class="mb-6">
            <Field name="text" v-slot="{ field, meta }">
              <label for="insertText" class="block text-center">Description</label>
              <input v-bind="field" :class="
                !meta.touched || meta.valid
                  ? 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5'
                  : 'bg-gray-50 border text-gray-900 text-sm rounded-lg outline-red-500 border-red-500 block w-full p-2.5 mb-1'
              " placeholder="Description"  />
            </Field>
            <ErrorMessage name="text" class="block text-center" />
          </div>

          <hr class="my-2 border border-gray-500">

          <!~~Upload file~~>
          <div class="mb-6 grid justify-center">
            <Field name="upload" class="">
              <label for="formFile" class="text-center mb-3">Upload image</label>
              <input class="form-control" type="file" id="formFile" ref="fileUpload" @change="onChangeInput" />
            </Field>
            <ErrorMessage name="upload" class="block text-center" />
          </div>

          <!~~Text area for image url~~>
          <div class="mb-6">
            <fieldset :disabled="isDisabled">
              <Field name="imageUrl" v-slot="{ field, meta }" ref="temp">
                <label for="imageUrl" class="block text-center">Image url</label>
                <input v-bind="field" :class="
                  !meta.touched || meta.valid
                    ? 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5'
                    : 'bg-gray-50 border text-gray-900 text-sm rounded-lg outline-red-500 border-red-500 block w-full p-2.5 mb-1'
                " :placeholder="isDisabled ? 'Disabled image url' : 'Image url'" ref="imageText" />

              </Field>

              <ErrorMessage name="imageUrl" />
            </fieldset>
          </div>


          <!~~Preview image~~>
          <div class="hover:cursor-zoom-in" v-if="preview">
            <vue-final-modal v-model="enlargeImage" classes="modal-container" content-class="modal-content">
              <img @click="enlargeImageFunction" class="w-full hover:cursor-zoom-out" :src="preview" />
            </vue-final-modal>
            <img @click="enlargeImageFunction" class="lg:max-w-2xl md:max-w-lg sm:max-w-sm" :src="preview" />
          </div>

          <hr class="my-2 border border-gray-500">

          <!~~ Categories ~~>
          <div class="my-4">
            <Multiselect v-model="categoryOptions" :options="getAllCategories.map(i => i.name)" mode="tags"
              placeholder="Select categories" :close-on-select="false" :searchable="true" />
            <ErrorMessage name="categoryOptions" class="block text-center" />
          </div>


          <!~~ Checkbox for comments~~>
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

          <div :class="getIsLoading ? 'flex justify-center relative' : 'container text-center'">
            <button
              :class="getIsLoading ? 'btn btn-blue btn-disabled m-auto block' : 'btn btn-blue m-auto block'">Submit</button>

            <!~~Loading ~~>
            <div role="status" v-show="getIsLoading" class="mt-1 absolute right-0">
              <svg aria-hidden="true" class="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"></path>
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"></path>
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </Form>

      </div>
    </div>
  </div>
-->

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

//validate
import { required, minLength, helpers, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'


import Multiselect from '@vueform/multiselect'

//types
import { PostRequest } from "../types";
import { SingleCategory } from "../category-types";

//components
import InputField from "@/components/InputField.vue";



export default defineComponent({
  name: "PostRequest",
  components: {
    //Multiselect,
    InputField
  },
  data() {
    /*
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

            if (value?.length === 0 || value === undefined) {
              return true;
            }

            return false;
          },
          then: yup.mixed().required("Image url is empty, upload image instead")
        }),

    });
    */

    return {
      title: '' as string,
      description: '' as string,
      url: '' as string,
      lockImgUrl: false as boolean,


      locationOfFile: null as File | null,
      isDisabled: false,
      isAllowedComment: false,
      disableButton: false,
      preview: '',
      enlargeImage: false,
      categoryOptions: [],
    };
  },
  computed: {
    ...mapState(useAuthenticationStore, ["getCurrentlyLoggedUserProfile"]),
    ...mapState(usePostStore, ["getIsLoading"]),
    ...mapState(useCategoryStore, ['getAllCategories'])
  },
  setup() {
    const toast = useToast();

    return { toast, v$: useVuelidate() };
  },
  validations() {
    return {
      title: { required },
      locationOfFile: {
        checkIfImageIsUploaded: this.checkIfImageIsUploaded()
      },
      url: {
        requiredIfUploadIsEmpty: requiredIf(this.ifImageIsUploadedLockUrlAndClearInput()),
        helpers: helpers.withMessage('Mush contain x', helpers.regex(/^$|\s+|(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#]*\.(?:jpg|gif|png|wpeg|jpeg))(?:\?([^#]*))?(?:#(.*))?/))
      }
    }
  },
  methods: {
    ...mapActions(usePostStore, ["savePost"]),
    ...mapActions(useCategoryStore, ['fetchAllCategories']),
    test: function (): void {
      console.log("test", this.v$.url.$errors[0]?.$message?.toString())
      this.v$.$validate();
    },
    ifImageIsUploadedLockUrlAndClearInput: function (): boolean {
      if (this.locationOfFile !== null) {
        //clear url
        this.url = '';
        this.lockImgUrl = true;
        return true;
      }
      return false;
    },
    checkIfImageIsUploaded: function (): boolean {
      console.log("check update");
      if (this.locationOfFile !== null)
        return true;
      else
        return false
    },
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
      this.isDisabled = true;

      //for preview
      this.preview = URL.createObjectURL(this.locationOfFile);
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
