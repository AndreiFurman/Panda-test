<template>
    <svg :class="'icon icon-'+id">
        <use :xlink:href="file+'#'+id" :href="file+'#'+id"></use>
    </svg>
</template>
<script>
    export default {
        name: "Icon",
        props: {
            id: {required: true},
            file: {default: "icon/sprite.svg"}
        },
        mounted() {
        }
    }
</script>
