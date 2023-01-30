<template>
  <div class="grid justify-center">

    <!--Post card-->
    <CustomCard :hasLikeAndDislike="true" :hasCategories="false" :currentlyLoggedUser="null" :post="getPostById">
      <template #image>
        <img :src="getPostById.imageUrl" class="w-fit h-fit mb-6 px-6" />
      </template>

      <template #cardText>
        <div class="grid">
          <Text class="text-center break-words" :title="getPostById.title" :description="getPostById.description" />
        </div>
      </template>

      <template #cardIcons>
        <div class="flex">
          <span class="my-auto font-sans">Posted by</span>
          <IconsForCard :post="getPostById" />
        </div>
      </template>

    </CustomCard>

    <!--Comment component-->
    <div class="text-center" v-if="getPostById.id !== 0">
      <CommentSection :post="getPostById" />
    </div>

  </div>

</template>


<script lang="ts">
import { defineComponent } from "vue";

//pinia
import { usePostStore } from "@/Post/store/store";
import { useUserStore } from "@/User/store/store";
import { mapActions, mapState } from "pinia";

//components
import CommentSection from "@/Comment/components/Comment.vue";
import CustomCard from "@/components/CustomCard/Cards.vue";
import Text from '@/components/CustomCard/Text.vue'
import IconsForCard from '@/Post/components/CardIcons.vue'



export default defineComponent({
  name: "App",
  components: {
    CommentSection,
    CustomCard,
    Text,
    IconsForCard
  },
  props: {
    id: String,
  },
  methods: {
    ...mapActions(usePostStore, ["fetchPostById"]),
  },
  computed: {
    ...mapState(usePostStore, ["getPostById"]),
    ...mapState(useUserStore, ["user"]),
  },
  beforeMount() {
    if (this.id !== undefined) {
      let toNumber: number = parseInt(this.id);
      this.fetchPostById(toNumber);
    }
  },
});
</script>

