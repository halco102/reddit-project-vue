<template>
  <div class="main" ref="request">
    <NavigationBar />
    <div class="post-card">
      <h3>Upload a post</h3>
      <div class="card" style="width: 35rem">
        <div class="card-body">
          <Form @submit="onSubmit" :validation-schema="schema">
            <div class="mb-3">
              <Field name="title" v-slot="{ field, meta }">
                <label for="insertText" class="form-label">Title</label>
                <input
                  v-bind="field"
                  :class="
                    !meta.touched || meta.valid
                      ? 'form-control'
                      : 'form-control form-color-error'
                  "
                />
              </Field>
              <ErrorMessage name="title" />
            </div>
            <div class="mb-3">
              <Field name="text" v-slot="{ field, meta }">
                <label for="insertText" class="form-label">Description</label>
                <input
                  v-bind="field"
                  :class="
                    !meta.touched || meta.valid
                      ? 'form-control'
                      : 'form-control form-color-error'
                  "
                />
              </Field>
              <ErrorMessage name="text" />
            </div>

            <div class="mb-3">
              <Field name="upload">
                <label for="formFile" class="form-label">Upload image</label>
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  ref="fileUpload"
                  @change="onChangeInput"
                />
              </Field>
              <ErrorMessage name="upload" />
            </div>

            <div class="mb-3">
              <fieldset :disabled="isDisabled">
                <label for="imageUrl" class="form-label">Image url</label>
                <Field name="imageUrl" class="form-control" />
                <ErrorMessage name="imageUrl" />
              </fieldset>
            </div>

            <div class="comment-checkbox-button">
              <div class="mb-3">
                <div class="form-check allign">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="allowCommentsCheck"
                    v-model="isAllowedComment"
                  />
                </div>
                <label class="form-check-label" for="allowCommentsCheck">
                  Allow comments
                </label>
              </div>
            </div>

            <button class="btn btn-primary">Submit</button>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "../store/UserStore";
import { usePostStore, PostRequest } from "../store/PostStore";
import { mapState, mapActions } from "pinia";
import NavigationBar from "./NavigationBar.vue";
import { useToast } from "vue-toastification";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default defineComponent({
  name: "PostRequest",
  components: {
    NavigationBar,
    Field,
    Form,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      title: yup.string().required("Title is required"),
      text: yup.string().optional().default(""),
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
            if (temp.size > 5097152) {
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
    };
  },
  computed: {
    ...mapState(useUserStore, ["getUserLogin"]),
    ...mapState(usePostStore, ["isLoading"]),
  },
  setup() {
    const toast = useToast();

    return { toast };
  },
  methods: {
    ...mapActions(usePostStore, ["savePost"]),
    isRequired: function (value: string): boolean | string {
      return value ? true : "This field is required";
    },
    onSubmit(values: PostRequest) {
      values.allowComments = this.isAllowedComment;

      if (this.getUserLogin.userProfileDto.id !== 0) {
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
    },
  },
});
</script>

<style scoped>
.main h3 {
  color: wheat;
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
