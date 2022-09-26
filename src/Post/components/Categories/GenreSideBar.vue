<template>
  <!--Side bar categories-->
  <div class="sm:flex md:grid lg:grid border-solid border-2 rounded p-2 border-black">

    <ButtonComponent class="my-auto flex justify-around hover:bg-gray-400 "
      v-for="category in categories" :key="category.id" :title="category.name" :disabled="false">
      <template #icon>
        <img :src="category.iconUrl" class="w-12 h-12 ml-3" />
      </template>

    </ButtonComponent>
    
  </div>


</template>

<script lang="ts">
import { SingleCategory } from '@/Post/category-types';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';
import { usePostStore } from '@/Post/store/store';
import ButtonComponent from '@/components/ButtonComponent.vue';


export default defineComponent({
  name: 'GenreSideBar',
  components: {
    ButtonComponent
  },
  props: {
    categories: Object as () => SingleCategory[],
  },
  methods: {
    ...mapActions(usePostStore, ['getPostsByCategoryName'])
  }

})
</script>