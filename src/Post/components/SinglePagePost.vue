<template>
  <div class="grid justify-center">

    <!--Post card-->
    <CustomCard class="grid justify-center" :hasLikeAndDislike="false" :hasCategories="false"
      :currentlyLoggedUser="null" :post="post">
      <template #image>
        <img :src="post.imageUrl" class="w-fit h-fit" />
      </template>

      <template #cardText>
        <div class="grid hover:bg-gray-300 hover:cursor-pointer">
          <Text class="text-center break-words" :title="post.title" :description="post.text" />
        </div>
      </template>

    </CustomCard>

    <!--Comment component-->
    <div class="text-center">
      <CommentSection :post="post" />
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


export default defineComponent({
  name: "App",
  components: {
    CommentSection,
    CustomCard,
    Text
  },
  created() {
    let toNumber: number = parseInt(this.id!);
    console.log("toNumber ", toNumber);
    const getById = this.fetchPostById(toNumber);
  },
  props: {
    id: String,
  },
  methods: {
    ...mapActions(usePostStore, ["fetchPostById"]),
  },
  computed: {
    ...mapState(usePostStore, ["post"]),
    ...mapState(useUserStore, ["user"]),
  },
});
</script>

