<template>
    <button class="font-bold py-2 px-4 rounded" @click="onClick">

        <span v-if="title != undefined" :class="hasIcon ? 'my-auto ' : ''">
            {{title}}
        </span>

        <template v-if="hasIcon">
            <slot name="icon"></slot>
        </template>

    </button>
</template>

<script lang="ts">

import { defineComponent, useSlots } from 'vue';


export default defineComponent({
    name: 'ButtonComponent',
    props: {
        title: {
            type: String,
            default: '',
            required: false
        },
        disabled: {
            type: Boolean || undefined,
            required: true
        },
        directionOfImage: String || undefined
    },
    setup() {
        const slot = useSlots();

        return { slot }
    },
    computed: {
        hasIcon: function (): boolean {
            return !!this.slot.icon;
        },
    },
    methods: {
        onClick: function (): void {
            this.$emit("onClick",);
        }
    },
    mounted(){
        switch(this.directionOfImage) {
            case 'LEFT' :{
                this.customCss += 'order-1'
                break;
            }
            case 'RIGHT' : {
                this.customCss += 'order-2';
                break;
            }
            default: {
                console.log("Wrong")
                break;
            }
        }
    },
    data(){
        return{
            customCss: ''
        }
    }
})
</script>