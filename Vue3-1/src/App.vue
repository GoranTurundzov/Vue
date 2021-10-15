<template>
    <div class="app">
        <submissions-table
            v-if="!showSubmissionForm && data && formSelectOptions"
            :table-data="data"
            :form-select-options="formSelectOptions"
            @delete-this-submission="confirmationDelete"
            @create-new-submission="toggleSubmissionForm"
            @edit-this-submission="editSubmission"
        ></submissions-table>
        <submission-form
            v-if="showSubmissionForm && formSelectOptions"
            :edited-submission-index="submissionIndexedForEditing"
            :submission-to-edit="submissionForEditing"
            :formSelectOptions="formSelectOptions"
            @edit-the-submission="editSubmissionSubmit"
            @create-new-submission="createNewSubmission"
            @close-form="closeForm"
        ></submission-form>
        <modal 
            v-if="deleteModal" 
            name="delete-modal" 
            data-testid="delete-modal-component"
            @close-modal="toggleDeleteModal"
        >
            <template v-slot:header>
                <h3>Delete submission</h3>
            </template>
            <p>Are you sure you want to delete this submission?</p>
            <template v-slot:footer>
                <button class="btn btn-secondary" @click="toggleDeleteModal">
                    <i class="fa fa-times"></i> Cancel
                </button>
                <button
                    class="btn btn-primary"
                    @click="deleteSubmission"
                    data-testid="confirm-delete-button"
                >
                    <i class="fa fa-check"></i> Confirm
                </button>
            </template>
        </modal>
    </div>
</template>

<script>
import SubmissionsTable from './components/SubmissionsTable';
import submissionCall from './services/SubmissionJsonService';
import formatter from './services/SubmissionsFormatter';
import Modal from './components/Modal.vue';
import formTypes from './services/formSelectionService';
import SubmissionForm from './components/SubmissionForm.vue';

export default {
    name: 'App',
    components: {
        SubmissionsTable,
        Modal,
        SubmissionForm
    },
    data() {
        return {
            rawData: null,
            data: null,
            deleteModal: false,
            submissionIndexedForDeletion: null,
            formSelectOptions: null,
            showSubmissionForm: false,
            submissionIndexedForEditing: -1,
            submissionForEditing: null
        };
    },
    async created() {
        try {
            let rawData = await submissionCall();
            let formatedData = formatter(rawData);
            this.data = formatedData;
            let formData = await formTypes();
            this.formSelectOptions = formData;
        } catch (error) {
            throw new Error(error);
        }
    },
    methods: {
        deleteSubmission() {
            this.data.splice(this.submissionIndexedForDeletion, 1);
            this.toggleDeleteModal();
        },
        confirmationDelete(index) {
            this.deleteModal = true;
            this.submissionIndexedForDeletion = index;
        },
        toggleDeleteModal() {
            this.deleteModal = !this.deleteModal;
        },
        toggleSubmissionForm() {
            this.showSubmissionForm = !this.showSubmissionForm;
        },
        createNewSubmission(submission) {
            submission.form_type = submission.form.form_type;
            submission.form = submission.form.name;
            this.data.unshift(submission);
            this.showSubmissionForm = false;
        },
        closeForm() {
            this.submissionIndexedForEditing = -1;
            this.submissionForEditing = null;
            this.toggleSubmissionForm();
        },
        editSubmission(item) {
            this.submissionForEditing = item;
            this.submissionIndexedForEditing = this.data.findIndex(x => x == item);
            this.toggleSubmissionForm();
        },
        editSubmissionSubmit(submission, index) {
            submission.form_type = submission.form.form_type;
            submission.form = submission.form.name;
            this.data[index] = submission;
            this.closeForm();
        }
    }
};
</script>

<style>
@import url('../src/assets/Styles/bootstrap.min.css');
@import url('../src/assets/Styles/new_site.min.css');
@import url('../src/assets/Styles/style.css');
</style>
