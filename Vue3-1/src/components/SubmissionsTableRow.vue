<template>
    <div class="content justify-center">
        <submissions-table-cell
            v-for="(key, value) in rowData"
            :title="value"
            :align-in-rows="alignInRows"
            :text="key"
            :key="key"
        ></submissions-table-cell>
        <div class="column" v-if="!alignInRows">
            <div>Action</div>
            <div>
                <button class="btn btn-gray btn-sm push-5-r" @click="editSubmission">
                    <i class="fa fa-edit"></i>
                </button>
                <button
                    class="btn btn-gray btn-sm push-5-r"
                    @click="activateModal"
                    data-testid="modal-activator"
                >
                    <i class="fa fa-eye"></i>
                </button>
                <button
                    class="btn btn-gray btn-sm push-5-r"
                    @click="deleteSubmission"
                    data-testid="delete-activator"
                >
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import SubmissionsTableCell from './SubmissionsTableCell';

export default {
    components: {
        SubmissionsTableCell
    },
    name: 'SubmissionsTableRow',
    props: {
        rowData: {
            type: Object,
            required: true,
            description: 'A single row worth of data'
        },
        alignInRows: {
            type: Boolean,
            default: false,
            description: 'Direction on how the row will be printed (column =false; row = true)'
        }
    },
    emits: ['activate-modal', 'delete-submission', 'edit-submission'],
    methods: {
        activateModal() {
            this.$emit('activate-modal', this.rowData);
        },
        deleteSubmission() {
            this.$emit('delete-submission', this.rowData);
        },
        editSubmission() {
            this.$emit('edit-submission', this.rowData);
        }
    }
};
</script>

<style scoped>
.column {
    display: table-cell;
    text-align: left;
    min-width: 10.5vw;
    max-width: 10.5vw;
    font-size: 1.2rem;
    vertical-align: middle;
}
button:hover {
    transform: scale(1.2);
}
@media screen and (max-width: 1200px) {
    .content {
        flex-direction: column;
        padding: 5%;
        font-size: 1rem;
    }
    .column {
        display: block;
        width: 100%;
        min-width: 100%;
    }
}
</style>
