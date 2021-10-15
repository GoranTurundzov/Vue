<template>
    <div :class="direction">
        <div class="title text-capitalize">{{ title.replace('_', ' ') }}</div>
        <div class="font-w600 data-content" :class="title">{{ text }}</div>
    </div>
</template>

<script>
export default {
    name: 'SubmissionsTableRowColumn',
    props: {
        title: {
            required: true,
            description: 'The title of a single column from a table',
            type: String
        },
        text: {
            required: true,
            description: 'The content of a single column from a table',
            type: [String, Number, Boolean]
        },
        alignInRows: {
            type: Boolean,
            description: 'Column or Row that will affect how the cells will allign',
            default: false
        }
    },
    computed: {
        direction() {
            if (this.alignInRows == true) {
                return 'row border-b';
            }
            return 'column';
        }
    }
};
</script>
