<template>
  <!--Main div-->
  <div class="grid justify-center my-6 ">

    <div class="border border-gray-500 rounded p-4">
      <!--text -->
      <div>
        <h3 class="font-bold text-center">Upload a post</h3>
      </div>

      <!-- Title and description input fields-->
      <div class="my-6 flex flex-col gap-4">
        <!--Title-->
        <InputField type="text" :modelValue="title" name="title" placeholder="Title" label="Title*"
          @update:model-value="(newValue: string) => (title = newValue)" :error="v$.title.$error"
          :errorText="v$.title.$errors[0]?.$message?.toString()" />

        <!--Description-->
        <InputField type="text" :modelValue="description" name="description" placeholder="Description"
          label="Description" @update:model-value="(newValue: string) => (description = newValue)" />

        <hr class="border border-black" />
      </div>

      <!--For image upload and url input-->
      <div class="flex flex-col gap-4">

        <div class="mb-3 ">
          <label class="block mb-2 text-sm font-medium text-gray-900" for="file_input">Upload
            file</label>
          <input
            class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input" type="file" @change="onChangeInput" />
          <ErrorComponent :errorName="'file'" :errorText="v$.locationOfFile.$errors[0]?.$message?.toString()" />
        </div>

        <InputField type="text" :modelValue="url" name="url" placeholder="Url" label="Url"
          @update:model-value="(newValue: string) => (url = newValue)" :error="v$.url.$error"
          :errorText="v$.url.$errors[0]?.$message?.toString()" :disabled="lockImgUrl" />

        <!--If image is uploaded or url is put show preview-->
        <div v-if="(url.length > 0 && checkRegex()) || locationOfFile !== null" class="max-w-lg">
          <img :src="preview === null ? url : preview" v-if=!showModal class="cursor-zoom-in"
            @click="showModal = true" />

          <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content" v-else>
            <img :src="preview === null ? url : preview" class="cursor-zoom-out" @click="showModal = false" />
          </vue-final-modal>

        </div>

        <hr class="border border-black" />
      </div>

      <!--Multi select-->
      <div class="my-4">
        <Multiselect v-model="categoryOptions" :options="getAllCategories.map(i => i.name)" mode="tags"
          placeholder="Select categories" :close-on-select="false" :searchable="true" />
        <ErrorComponent :errorName="'categoryOptions'" v-if="v$.categoryOptions.$errors.length > 0"
          :errorText="'Select one or more categories'" />
      </div>

      <!--Check button-->
      <div class="grid justify-center my-4">
        <input type="checkbox" name="allowComments" v-model="isAllowedComment" class="w-4 h-4 mx-auto block">
        <label>Allow comments</label>
      </div>

      <!--Submit Button-->
      <div class="justify-center flex relative">
        <ButtonComponent title="Submit" :disabled="getIsLoading" @onClick="submitRequest" />

        <!--Loading -->
        <div role="status" v-if="getIsLoading" class="mt-1 absolute right-0">
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

//validate
import { required, helpers, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import ErrorComponent from "@/components/vuelidate/ErrorComponent.vue";


import Multiselect from '@vueform/multiselect'
import ButtonComponent from '@/components/ButtonComponent.vue'

//types
import { PostRequest } from "../types";
import { SingleCategory } from "../category-types";

//components
import InputField from "@/components/InputField.vue";



export default defineComponent({
  name: "PostRequest",
  components: {
    Multiselect,
    InputField,
    ErrorComponent,
    ButtonComponent
  },
  data() {
    return {
      title: '' as string,
      description: '' as string,
      url: '' as string,
      lockImgUrl: false as boolean,
      locationOfFile: null as File | null,

      isDisabled: false,
      isAllowedComment: false,
      disableButton: false,
      preview: null as string | null,
      enlargeImage: false,
      categoryOptions: [],
      showModal: false,
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
        requireIfImgUrlIsEmpty: requiredIf(this.checkIfImageIsUploaded())
      },
      url: {
        requiredIfUploadIsEmpty: requiredIf(this.ifImageIsUploadedLockUrlAndClearInput()),
        helpers: helpers.withMessage('Must contain jpg, gif, png, wpeg, jpeg', helpers.regex(/^$|\s+|(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#]*\.(?:jpg|gif|png|wpeg|jpeg))(?:\?([^#]*))?(?:#(.*))?/))
      },
      categoryOptions: {
        required
      }
    }
  },
  methods: {
    ...mapActions(usePostStore, ["savePost"]),
    ...mapActions(useCategoryStore, ['fetchAllCategories']),
    checkRegex: function (): boolean {
      if (this.url.match(/^$|\s+|(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#]*\.(?:jpg|gif|png|wpeg|jpeg))(?:\?([^#]*))?(?:#(.*))?/))
        return true;

      return false;
    },
    //if url is empty and fileupload is not empty, lock image url and clear input
    ifImageIsUploadedLockUrlAndClearInput: function (): boolean {
      if (this.locationOfFile !== null) {
        //clear url
        this.url = '';
        this.lockImgUrl = true;
        return false;
      }
      return true;
    },
    checkIfImageIsUploaded: function (): boolean {
      if (this.url.length > 0 && this.locationOfFile === null) {
        return false;
      }
      else
        return true;
    },
    isRequired: function (value: string): boolean | string {
      return value ? true : "This field is required";
    },
    submitRequest: function (): void {
      this.v$.$validate();

      let categoriesObjects = this.findCategoryObjectByName(this.categoryOptions);
      console.log("options", categoriesObjects)


      if (this.v$.$error)
        return;

      this.savePost({
        title: this.title,
        text: this.description,
        imageUrl: this.url,
        allowComments: this.isAllowedComment,
        categories: categoriesObjects
      }, this.locationOfFile)
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

input[type=file]::-webkit-file-upload-button,
input[type=file]::file-selector-button {
  @apply text-white bg-gray-700 font-medium text-sm cursor-pointer border-0 py-2 pl-6 pr-2;
  margin-inline-start: -1rem;
  margin-inline-end: 1rem;
}
</style>
