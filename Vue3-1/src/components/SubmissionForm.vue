<template>
   <div class="content content-boxed bg-light">
        <div class="push-left">
            <button 
                class="btn btn-gray push-7-l"
                data-testid="go-back-form-button" 
                @click="closeForm"
            >
                <i class="fas fa-angle-left push-10-r"></i>Back
            </button>
        </div>
        <div class="justify-content-center">
            <h3>{{ title }}</h3>
        </div>
        <div class="content-narrow">
            <form class="form-horisontal block-content content" @submit="submitForm">
                <div class="row">
                    <div class="form-group" :class="{ 'has-error': !validName }">
                        <div class="col-xs-8 ">
                            <label for="Name" class="form-label floating open">Name*</label>
                        </div>
                        <div class="col-xs-12">
                            <input
                                v-model="submission.name"
                                type="text"
                                name="Name"
                                class="form-control"
                                @focus="removeNameError"
                                data-testid="name-input"
                            />
                        </div>
                    </div>
                    <div class="es-required-field col-md-6" v-if="!validName">
                        <i class="fas fa-exclamation-circle"></i>
                        This field is required.
                    </div>
                </div>
                <div class="row">
                    <div class="form-group" :class="{ 'has-error': emailError }">
                        <div class="col-xs-8">
                            <label for="Email" class="form-label floating open">Email*</label>
                        </div>
                        <div class="col-xs-12">
                            <input
                                v-model="submission.email"
                                type="text"
                                name="Email"
                                class="form-control"
                                @focus="removeEmailError"
                                data-testid="email-input"
                            />
                        </div>
                    </div>
                    <div class="es-required-field col-md-6 " v-if="!validEmail">
                        <i class="fas fa-exclamation-circle"></i>
                        This field is required.
                    </div>
                    <div class="es-required-field col-md-6 " v-if="!validEmailFormat">
                        <i class="fas fa-exclamation-circle"></i>
                        Enter a valid e-mail
                    </div>
                </div>
                <div class="row">
                    <div class="form-group">
                        <div class="col-xs-8">
                            <label for="Recommendation" class="form-label floating open">
                                Recommendation
                            </label>
                        </div>
                        <div class="col-xs-12">
                            <select
                                name="Recommendation"
                                v-model="submission.recommendation"
                                class="form-control"
                                data-testid="recommendation-input"
                            >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                <option value="maybe">Maybe</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group" :class="{ 'has-error': !validFeedback }">
                        <div class="col-xs-8">
                            <label for="Feedback" class="form-label floating open">Feedback*</label>
                        </div>
                        <div class="col-xs-12">
                            <textarea
                                name="Feedback"
                                v-model="submission.feedback"
                                rows="5"
                                class="form-control"
                                @focus="removeFeedbackError"
                                data-testid="feedback-input"
                            ></textarea>
                        </div>
                    </div>
                    <div class="es-required-field col-md-6" v-if="!validFeedback">
                        <i class="fas fa-exclamation-circle"></i>
                        This field is required.
                    </div>
                </div>
                <div class="row">
                    <div class="form-group" :class="{ 'has-error': dateError }">
                        <div class="col-xs-8">
                            <label for="Date" class="form-label floating open" type="date"
                                >Date*</label
                            >
                        </div>
                        <div class="col-xs-12">
                            <input
                                v-model="submission.date"
                                class="form-control"
                                type="text"
                                name="Date"
                                placeholder="DD/MM/YYYY"
                                @focus="removeDateError"
                                data-testid="date-input"
                            />
                        </div>
                    </div>
                    <div class="es-required-field col-md-6" v-if="dateError">
                        <div v-if="!validDate">
                            <i class="fas fa-exclamation-circle"></i>
                            This field is required.
                        </div>
                        <div v-if="!validDateFormat">
                            <i class="fas fa-exclamation-circle"></i>
                            Enter a valid date in dd/MM/yyyy format only.
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group" :class="{ 'has-error': !validForm }">
                        <div class="col-xs-8">
                            <label for="Form" class="form-label floating open">Form*</label>
                        </div>
                        <div class="col-xs-12">
                            <select
                                v-model="submission.form"
                                name="Form"
                                class="form-control"
                                @change="removeFormError"
                                data-testid="form-input"
                            >
                                <option disabled selected value="">Select a form</option>
                                <option
                                    v-for="option of formSelectOptions"
                                    :value="option"
                                    :key="option.name"
                                    >{{ option.name }} - {{ option.form_type }}</option
                                >
                            </select>
                        </div>
                    </div>
                    <div class="es-required-field col-md-6" v-if="!validForm">
                        <i class="fas fa-exclamation-circle"></i>
                        This option is required.
                    </div>
                </div>
                <div class="row">
                    <div class="form-group">
                        <div class="col-xs-8">
                            <label for="Status" class="form-label floating open">Status</label>
                        </div>
                        <div class="col-xs-12">
                            <select
                                name="Status"
                                v-model="submission.status"
                                class="form-control"
                                data-testid="status-input"
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-xs-12 text-center">
                        <button
                            type="submit"
                            class="btn btn-primary form-material"
                            data-testid="submit-submission-button"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        submissionToEdit: {
            type: Object,
            description: 'prop which will be passed to fill out the form with the submission to edit'
        },
        formSelectOptions: {
            type: Array,
            required: true,
            description: 'Options for the form select'
        },
        editedSubmissionIndex: {
            type: Number,
            default: -1,
            description: 'if this is passed the form will be used for editing'
        }
    },
    emits: ['close-form', 'create-new-submission', 'edit-the-submission'],
    data() {
        return {
            submission: {
                name: '',
                email: '',
                recommendation: 'yes',
                feedback: '',
                date: '',
                form: '',
                status: 'pending'
            },
            validName: true,
            validEmail: true,
            validFeedback: true,
            validForm: true,
            validDate: true,
            validDateFormat: true,
            validEmailFormat: true
        };
    },
    computed: {
        dateError() {
            if (!this.validDate || !this.validDateFormat) {
                return true;
            }
            return false;
        },
        emailError() {
            if (!this.validEmail || !this.validEmailFormat) {
                return true;
            }
            return false;
        }
    },
    created() {
        if (this.editedSubmissionIndex >= 0) {
            this.title = 'Edit ' + this.submissionToEdit.name + ' Submission';
            this.submission.name = this.submissionToEdit.name;
            this.submission.email = this.submissionToEdit.email;
            this.submission.recommendation = this.submissionToEdit.recommendation;
            this.submission.feedback = this.submissionToEdit.feedback;
            this.submission.form = {
                name: this.submissionToEdit.form,
                form_type: this.submissionToEdit.form_type
            };
            this.submission.status = this.submissionToEdit.status;
            this.submission.date = this.submissionToEdit.date;
        } else {
            this.title = 'Create new submission';
        }
    },
    methods: {
        submitForm(e) {
            e.preventDefault();
            this.validName = this.submission.name.trim() === '' ? false : true;
            this.validEmail = this.submission.email.trim() === '' ? false : true;
            this.validFeedback = this.submission.feedback.trim() === '' ? false : true;
            this.validForm = this.submission.form === '' ? false : true;
            this.validDate = this.submission.date.trim() === '' ? false : true;
            if (this.validDate) {
                this.validDateFormat = this.dateValidation();
            }
            if (this.validEmail) {
                this.validEmailFormat = this.emailValidation();
            }
            if (
                this.validName &&
                this.validEmail &&
                this.validFeedback &&
                this.validForm &&
                this.validDate &&
                this.validEmailFormat &&
                this.validDateFormat
            ) {
                if (this.editedSubmissionIndex < 0) {
                    this.$emit('create-new-submission', this.submission);
                } else {
                    this.$emit('edit-the-submission', this.submission, this.editedSubmissionIndex);
                }
            }
        },
        closeForm() {
            this.$emit('close-form');
        },
        dateValidation() {
            var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
            if (this.submission.date.match(reg)) {
                let parts = this.submission.date.split('/');
                var enteredTime = new Date(parts[1] + '/' + parts[0] + '/' + parts[2]);
                var timeNow = new Date();
                if (enteredTime <= timeNow) {
                    return true;
                }
            }
            return false;
        },
        removeNameError() {
            this.validName = true;
        },
        removeDateError() {
            this.validDate = true;
            this.validDateFormat = true;
        },
        removeEmailError() {
            this.validEmail = true;
            this.validEmailFormat = true;
        },
        removeFormError() {
            this.validForm = true;
        },
        removeFeedbackError() {
            this.validFeedback = true;
        },
        emailValidation() {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(this.submission.email).toLowerCase());
        }
    }
};
</script>

<style scoped>
textarea {
    resize: none;
}
.es-required-field {
    color: #ff3636;
    display: block;
    font-size: 14px;
    margin-top: 8px;
    text-align: left;
}
</style>
