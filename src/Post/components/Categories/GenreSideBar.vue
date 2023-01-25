<template>
  <!--Side bar categories-->
  <div class="sm:flex md:grid lg:grid border-solid border-2 rounded p-2 border-black">

    <VButtonIcon :label="category.name" v-for="category in categories" :key="category.id"
      class="mb-2 focus:outline-none focus:ring focus:bg-gray-500 hover:bg-gray-500"
      @onClick="filterByCategory(category.name)">

      <template #icon>
        <img :src="category.imageUrl" class="w-12 h-12" />
      </template>

    </VButtonIcon>

  </div>


</template>

<script lang="ts">
import { SingleCategory } from '@/Post/category-types';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';
import { usePostStore } from '@/Post/store/store';
import VButtonIcon from '@/components/VButtonIcon.vue';

export default defineComponent({
  name: 'GenreSideBar',
  components: {
    VButtonIcon
  },
  props: {
    categories: Object as () => SingleCategory[],
  },
  methods: {
    ...mapActions(usePostStore, ['getPostsByCategoryName']),
    filterByCategory: function (categoryName: string): void {
      this.$router.push({ name: 'FilterCategories', query: { category: categoryName } });

      //then fetch posts
      this.getPostsByCategoryName(categoryName);
    },

  }

})
</script>