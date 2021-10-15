<template>
    <div class="form-div">
        <form class="form-horizontal">
            <div class="block-content">
                <div class="form-group">
                    <label class="col-xs-12"> Form </label>
                    <div class="col-xs-12 push-20">
                        <select
                            class="form-control"
                            v-model="form"
                            @change="emitFilters"
                            data-testid="form-name-selector"
                        >
                            <option>All</option>
                            <option v-for="form in formSelectOptions" :key="form.name">
                                {{ form.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-xs-12"> Form Type </label>
                    <div class="col-xs-12 push-20">
                        <select
                            class="form-control"
                            v-model="form_type"
                            @change="emitFilters"
                            data-testid="form-selector"
                        >
                            <option>All</option>
                            <option>Popup</option>
                            <option>Page</option>
                            <option>Email</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-xs-12"> Recommendation </label>
                    <div class="col-xs-12 push-20">
                        <select
                            class="form-control"
                            v-model="recommendation"
                            @change="emitFilters"
                            data-testid="recommendation-selector"
                        >
                            <option>All</option>
                            <option>Yes</option>
                            <option>No</option>
                            <option>Maybe</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-xs-12"> Date </label>
                    <div class="col-xs-12 push-20">
                        <select
                            class="form-control"
                            v-model="date"
                            @change="emitFilters"
                            data-testid="date-selector"
                        >
                            <option>All</option>
                            <option>Today</option>
                            <option>Yesterday</option>
                            <option>Month to date</option>
                            <option>Last month</option>
                            <option>Year to date</option>
                            <option>Last year</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-xs-12"> Status </label>
                    <div class="col-xs-12 push-20">
                        <select
                            class="form-control"
                            v-model="status"
                            @change="emitFilters"
                            data-testid="status-selector"
                        >
                            <option>All</option>
                            <option>Pending</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'SubmissionTableFilter',
    props: {
        propForm: {
            type: String,
            required: true,
            description: 'form name'
        },
        propFormType: {
            type: String,
            required: true,
            description: 'Filter prop'
        },
        propStatus: {
            type: String,
            required: true,
            description: 'Filter prop'
        },
        propDate: {
            type: String,
            required: true,
            description: 'Filter prop'
        },
        propRecommendation: {
            type: String,
            required: true,
            description: 'Filter prop'
        },
        formSelectOptions: {
            type: Array,
            required: true,
            description: 'Forms to select from'
        }
    },
    data() {
        return {
            form: 'All',
            form_type: 'All',
            status: 'All',
            date: 'All',
            recommendation: 'All'
        };
    },
    created() {
        this.form = this.propForm;
        this.form_type = this.propFormType;
        this.status = this.propStatus;
        this.recommendation = this.propRecommendation;
        this.date = this.propDate;
    },
    methods: {
        emitFilters() {
            this.$emit('change-filter', {
                form: this.form,
                status: this.status,
                date: this.date,
                recommendation: this.recommendation,
                form_type: this.form_type
            });
        }
    }
};
</script>
