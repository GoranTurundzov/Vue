import { mount } from '@vue/test-utils';
import SubmissionForm from '../../src/components/SubmissionForm';
import formJson from '../../public/forms.json';
import dummyData from '../../src/assets/DummyData';

let wrapper;

let spySubmitFormFn = jest.spyOn(SubmissionForm.methods, 'submitForm');
let spyEmailValidationFn = jest.spyOn(SubmissionForm.methods, 'emailValidation');
let spyDateValidationFn = jest.spyOn(SubmissionForm.methods, 'dateValidation');
let spyCloseFormFn = jest.spyOn(SubmissionForm.methods, 'closeForm');

describe('SubmissionForm', () => {
    beforeEach(() => {
        wrapper = mount(SubmissionForm, {
            props: {
                formSelectOptions: formJson,
                editedSubmissionIndex: -1
            }
        });
        wrapper.setData({
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
        });
    });

    it('App renders', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    test('Date Validatot works', async () => {
        let dateInput = wrapper.find('[data-testid="date-input"]');

        expect(wrapper.vm.validDateFormat).toBe(true);
        expect(wrapper.vm.validDate).toBe(true);

        dateInput.element.value = '';
        dateInput.trigger('input');

        await wrapper.find('form').trigger('submit');
        expect(wrapper.vm.validDateFormat).toBe(true);
        expect(wrapper.vm.validDate).toBe(false);

        dateInput.element.value = 'asddsa';
        dateInput.trigger('input');
        await wrapper.find('form').trigger('submit');
        expect(spyDateValidationFn).toBeCalled();
        expect(wrapper.vm.validDateFormat).toBe(false);
        expect(wrapper.vm.validDate).toBe(true);

        dateInput.element.value = '11/11/2020';
        dateInput.trigger('input');
        await wrapper.find('form').trigger('submit');
        expect(spyDateValidationFn).toBeCalled();
        expect(wrapper.vm.validDateFormat).toBe(true);
        expect(wrapper.vm.validDate).toBe(true);
    });

    test('Email validator works', async () => {
        let emailInput = wrapper.find('[data-testid="email-input"]');

        await wrapper.find('form').trigger('submit');
        expect(wrapper.vm.validEmail).toBe(false);
        expect(wrapper.vm.validEmailFormat).toBe(true);

        emailInput.element.value = 'Goran';
        emailInput.trigger('input');
        await wrapper.find('form').trigger('submit');
        expect(spyEmailValidationFn).toBeCalled();
        expect(wrapper.vm.validEmail).toBe(true);
        expect(wrapper.vm.validEmailFormat).toBe(false);

        emailInput.element.value = 'Goran@gmail.com';
        emailInput.trigger('input');
        await wrapper.find('form').trigger('submit');
        expect(spyEmailValidationFn).toBeCalled();
        expect(wrapper.vm.validEmail).toBe(true);
        expect(wrapper.vm.validEmailFormat).toBe(true);
    });

    it('Renders the title', async () => {
        await wrapper.setData({
            title: 'Submission Creation'
        });
        expect(wrapper.find('h3').text()).toEqual(wrapper.vm.title);
    });

    test('Form validation and submission works', async () => {
        let nameInput = wrapper.find('[data-testid="name-input"]');
        let emailInput = wrapper.find('[data-testid="email-input"]');
        let recommendationInput = wrapper.find('[data-testid="recommendation-input"]');
        let statusInput = wrapper.find('[data-testid="status-input"]');
        let feedbackInput = wrapper.find('[data-testid="feedback-input"]');
        let formInput = wrapper.find('[data-testid="form-input"]');
        let dateInput = wrapper.find('[data-testid="date-input"]');

        //inserting invalid inputs
        nameInput.element.value = '';
        nameInput.trigger('input');
        emailInput.element.value = 'Goran@gmail.com';
        emailInput.trigger('input');
        feedbackInput.element.value = 'the feedback string';
        feedbackInput.trigger('input');
        dateInput.element.value = 'asdas0';
        dateInput.trigger('input');
        recommendationInput.findAll('option')[1].setSelected();
        statusInput.findAll('option')[1].setSelected();
        formInput.findAll('option')[4].setSelected();

        await wrapper.find('form').trigger('submit');

        expect(wrapper.vm.validName).toBe(false);
        expect(wrapper.vm.validDateFormat).toBe(false);
        expect(spySubmitFormFn).toBeCalled();
        expect(spyEmailValidationFn).toBeCalled();
        expect(spyDateValidationFn).toBeCalled();
        expect(wrapper.emitted('create-new-submission', wrapper.vm.submission)).toBeFalsy();

        //inserting valid inputs
        dateInput.element.value = '11/11/2020';
        dateInput.trigger('input');
        nameInput.element.value = 'Goran';
        nameInput.trigger('input');

        await wrapper.find('form').trigger('submit');

        expect(wrapper.vm.validName).toBe(true);
        expect(wrapper.vm.validDate).toBe(true);
        expect(spySubmitFormFn).toBeCalled();
        expect(wrapper.emitted('create-new-submission', wrapper.vm.submission)).toBeTruthy();
        expect(wrapper.emitted('create-new-submission', wrapper.vm.submission)).toHaveLength(1);
        expect(wrapper.emitted('create-new-submission')[0][0]).toEqual(wrapper.vm.submission);
    });

    test('Back button', async () => {
        let backButton = wrapper.find('[data-testid="go-back-form-button"]');
        await backButton.trigger('click');
        expect(spyCloseFormFn).toBeCalled();
        expect(wrapper.emitted('close-form')).toBeTruthy();
        expect(wrapper.emitted('close-form')).toHaveLength(1);
    });

    test('Error messages appear when invalid input', async () => {
        let emailInput = wrapper.find('[data-testid="email-input"]');
        let recommendationInput = wrapper.find('[data-testid="recommendation-input"]');
        let statusInput = wrapper.find('[data-testid="status-input"]');
        let feedbackInput = wrapper.find('[data-testid="feedback-input"]');
        let formInput = wrapper.find('[data-testid="form-input"]');
        let dateInput = wrapper.find('[data-testid="date-input"]');

        expect(wrapper.findAll('.es-required-field')).toHaveLength(0);

        emailInput.element.value = 'Goran@gmail.com';
        emailInput.trigger('input');
        feedbackInput.element.value = 'the feedback string';
        feedbackInput.trigger('input');
        dateInput.element.value = 'asdas0';
        dateInput.trigger('input');
        recommendationInput.findAll('option')[1].setSelected();
        statusInput.findAll('option')[1].setSelected();
        formInput.findAll('option')[4].setSelected();

        await wrapper.find('form').trigger('submit');
        expect(spySubmitFormFn).toBeCalled();
        //it is expected to have 2 because the date format is invalid and there is nothing in the name field
        expect(wrapper.findAll('.es-required-field')).toHaveLength(2);
    });

    test('If an index is passed it loads that submission for editing and submits it', async () => {
        let editWrapper = mount(SubmissionForm, {
            props: {
                formSelectOptions: formJson,
                editedSubmissionIndex: 2,
                submissionToEdit: dummyData[2]
            }
        });
        let nameInput = editWrapper.find('[data-testid="name-input"]');
        let emailInput = editWrapper.find('[data-testid="email-input"]');
        let recommendationInput = editWrapper.find('[data-testid="recommendation-input"]');
        let statusInput = editWrapper.find('[data-testid="status-input"]');
        let feedbackInput = editWrapper.find('[data-testid="feedback-input"]');
        let formInput = editWrapper.find('[data-testid="form-input"]');
        let dateInput = editWrapper.find('[data-testid="date-input"]');

        expect(editWrapper.vm.submission).toEqual({
            name: 'Jonathan',
            email: 'jonathan@gmail.com',
            recommendation: 'maybe',
            feedback: 'My neighbor Karly has one of these. She works as a gambler and she says it looks tall. I saw one of these in Spratly Islands and I bought one. works okay.',
            date: '16/03/2021',
            form: { name: 'Form 3', form_type: 'page' },
            status: 'approved'
        });

        nameInput.element.value = 'Not Jonathan';
        nameInput.trigger('input');
        emailInput.element.value = 'Nojonathan@gmail.com';
        emailInput.trigger('input');
        feedbackInput.element.value = 'Changed';
        feedbackInput.trigger('input');
        dateInput.element.value = '16/07/2021';
        dateInput.trigger('input');
        recommendationInput.findAll('option')[2].setSelected();
        statusInput.findAll('option')[2].setSelected();
        formInput.findAll('option')[2].setSelected();

        expect(editWrapper.vm.submission).toEqual({
            name: 'Not Jonathan',
            email: 'Nojonathan@gmail.com',
            recommendation: 'maybe',
            feedback: 'Changed',
            date: '16/07/2021',
            form: { id: 24384, name: 'Form 2', form_type: 'page' },
            status: 'rejected'
        });

        await editWrapper.find('form').trigger('submit');
        expect(spySubmitFormFn).toBeCalled();
        expect(editWrapper.emitted('edit-the-submission', editWrapper.vm.submission, editWrapper.vm.submissionToEdit)).toBeTruthy();
        expect(editWrapper.emitted('edit-the-submission')).toHaveLength(1);
        expect(editWrapper.emitted('edit-the-submission')[0][0]).toEqual(editWrapper.vm.submission, editWrapper.vm.submissionToEdit);
    });
});
