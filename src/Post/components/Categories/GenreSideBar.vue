<template>
  <!--Side bar categories-->
  <div class="sm:flex md:grid lg:grid border-solid border-2 rounded p-2 border-black">

    <ButtonComponent class="bg-blue-500 mb-2 sm:mx-2 sm:px-6 sm:w-1/5 md:w-11/12 lg:w-11/12"
      v-for="category in categories" :key="category.id" :title="category.name" :disabled="false">
      <template #icon>
        <img :src="category.iconUrl" />
      </template>

    </ButtonComponent>

    <!--
    <button class="btn btn-blue mb-2 sm:mx-2 sm:px-6 sm:w-1/5 md:w-11/12 lg:w-11/12" v-for="category in categories"
      :key="category.id" @click.prevent="getPostsByCategoryName(category.name)">

      <router-link :to="{ name: 'FilterCategories', query: { category: category.name } }">

        <div class="flex justify-center">

          <img :src="category.iconUrl" class="lg:w-12 md:w-12 sm:w-10" />
          <div class="lg:m-auto md:m-auto sm:my-auto sm:ml-1 sm:mr-auto"><span>{{ category.name }}</span></div>

        </div>
      </router-link>
    </button>
    -->
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