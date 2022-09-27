<template>
    <div>
        <label v-if="label" for="testing"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 text-center">{{label}}</label>

        <div class="flex flex-col">
            <input :type="type === 'password' ? 'password' : 'username'" class="bg-gray-50 border border-gray-300
                 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                focus:border-blue-500 block w-full p-2.5
                  dark:text-white
                  dark:focus:ring-blue-500 dark:focus:border-blue-500" :value="modelValue" :placeholder="placeholder"
                :class="{
                    'mb-0 border-red-400 focus-visible:ring-red-600' : error
                }" @input="updateInput" v-bind="$attrs">


            <!--Errors-->
            <ErrorComponent v-if="error" :errorName="name + ' Error'" :errorText="errorText" />
        </div>

    </div>

</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { v4 as uuidv4 } from "uuid";
import ErrorComponent from './vuelidate/ErrorComponent.vue';

export type InputType = 'password' | 'text';

export default defineComponent({
    name: 'InputField',
    components: {
        ErrorComponent
    },
    props: {
        modelValue: {
            type: String,
            required: true
        },
        label: {
            type: String || undefined,
            required: false
        },
        placeholder: {
            type: String,
            required: true
        },
        type: {
            type: String as PropType<InputType>,
            required: true
        },
        error: Boolean,
        errorText: String,
        name: {
            type: String,
            default: 'input',
            required: true
        }
    },
    setup() {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            id: '' as string
        }
    },
    beforeMount() {
        this.id = uuidv4();
    },
    methods: {
        emit: function (value: string): void {
            this.$emit('update:modelValue', value);
        },

        updateInput(event: Event): void {
            const target = event.target as HTMLInputElement;
            this.emit(target.value);
        }
    }

})
</script>