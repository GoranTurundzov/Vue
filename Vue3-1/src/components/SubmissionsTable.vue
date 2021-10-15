<template>
    <div class="block-content">
        <div class="block">
            <select class="btn btn-default dropdown-toggle" @change="postsPerPage">
                <option value="5" selected>5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
            </select>
            <button
                class="btn btn-secondary margin-left"
                @click="toggleFilter"
                data-testid="open-filters-button"
            >
                Filter submissions
            </button>
            <button
                class="btn btn-primary pull-right"
                @click="createNewSubmission"
                data-testid="create-submission-button"
            >
                Create submission
            </button>
        </div>
        <div class="block block-bordered block-rounded">
            <submissions-table-row
                v-for="(item, index) in loadedSubmissions"
                :key="index"
                :row-data="item"
                class="row-hover"
                @activate-modal="triggerModal"
                @delete-submission="deleteSubmission"
                @edit-submission="editSubmission"
            ></submissions-table-row>
        </div>
        <div class="row justify-content-center">
            <button
                class="btn btn-primary justify-content-center"
                data-testid="test-load-more"
                v-if="showButton"
                @click="loadMore"
            >
                Load More
            </button>
        </div>
    </div>
    <modal v-if="modalActive" name="previev-submission-modal" @close-modal="triggerModal">
        <template v-slot:header>
            <h3>{{ modalData.name }}'s Submission</h3>
        </template>
        <submissions-table-row :align-in-rows="true" :row-data="modalData"></submissions-table-row>
    </modal>
    <modal v-if="filterModal" @close-modal="toggleFilter" name="filter-modal">
        <template v-slot:header>
            <h3>Filter Submissions</h3>
        </template>
        <submission-table-filter
            :prop-form-type="appliedFilters.form_type"
            :prop-status="appliedFilters.status"
            :prop-date="appliedFilters.date"
            :prop-recommendation="appliedFilters.recommendation"
            :prop-form="appliedFilters.form"
            :form-select-options="formSelectOptions"
            @cancel-filters="toggleFilter"
            @change-filter="stockFilter"
        >
        </submission-table-filter>
        <template v-slot:footer>
            <button class="btn btn-seconday" @click="toggleFilter">
                Cancel
            </button>
            <button
                class="btn btn-primary"
                @click="submitFilter"
                data-testid="submit-filters-button"
            >
                Continue
            </button>
        </template>
    </modal>
</template>

<script>
import SubmissionsTableRow from '@/components/SubmissionsTableRow';
import Modal from '@/components/Modal';
import SubmissionTableFilter from '@/components/SubmissionTableFilter';
import filterData from '../services/filterData';

export default {
    name: 'SubmissionsTable',
    components: {
        SubmissionsTableRow,
        Modal,
        SubmissionTableFilter
    },
    props: {
        tableData: {
            type: Array,
            required: true,
            description: 'it provides data for each row of the table'
        },
        formSelectOptions: {
            type: Array,
            required: true,
            description: 'Forms to select from'
        }
    },
    emits: ['delete-this-submission', 'create-new-submission', 'edit-this-submission'],
    data() {
        return {
            rowsToLoad: 5,
            timesLoaded: 1,
            filterModal: false,
            modalActive: false,
            modalData: null,
            selectedFilters: null,
            appliedFilters: {
                form: 'All',
                form_type: 'All',
                recommendation: 'All',
                date: 'All',
                status: 'All'
            }
        };
    },
    computed: {
        loadedSubmissions() {
            let loadedData = this.tableData;
            let filteredData = filterData(loadedData, this.appliedFilters);
            return filteredData.slice(0, this.rowsToLoad * this.timesLoaded);
        },
        showButton() {
            return this.rowsToLoad * this.timesLoaded <= this.loadedSubmissions.length;
        }
    },
    methods: {
        loadMore() {
            this.timesLoaded++;
        },
        postsPerPage(e) {
            this.timesLoaded = 1;
            this.rowsToLoad = e.target.value;
        },
        toggleFilter() {
            this.filterModal = !this.filterModal;
        },
        stockFilter(data) {
            this.selectedFilters = data;
        },
        submitFilter() {
            this.appliedFilters.form = this.selectedFilters.form;
            this.appliedFilters.status = this.selectedFilters.status;
            this.appliedFilters.recommendation = this.selectedFilters.recommendation;
            this.appliedFilters.date = this.selectedFilters.date;
            this.appliedFilters.form_type = this.selectedFilters.form_type;
            this.toggleFilter();
        },
        triggerModal(passedData) {
            this.modalData = passedData;
            this.modalActive = !this.modalActive;
        },
        deleteSubmission(item) {
            let deleteIndex = this.tableData.findIndex(x => x == item);
            this.$emit('delete-this-submission', deleteIndex);
        },
        editSubmission(item) {
            this.$emit('edit-this-submission', item);
        },
        createNewSubmission() {
            this.$emit('create-new-submission');
        }
    }
};
</script>

<style>
.margin-left {
    margin-left: 10px;
}
.row-hover:hover {
    box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.2);
    transform: scale(1.001);
}
</style>
