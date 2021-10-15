import { mount, flushPromises } from '@vue/test-utils';
import App from '@/App';
import SubmissionsTable from '@/components/SubmissionsTable';
import submissionCall from '../../src/services/SubmissionJsonService';
import formatter from '../../src/services/SubmissionsFormatter';
import formTypes from '../../src/services/formSelectionService';
import json from '../../public/submissions.json';
import formJson from '../../public/forms.json';
import dummyData from '../../src/assets/DummyData';
import SubmissionForm from '../../src/components/SubmissionForm';

let wrapper;

jest.mock('../../src/services/SubmissionsFormatter');
jest.mock('../../src/services/SubmissionJsonService');
jest.mock('../../src/services/formSelectionService');
let deleteSubmissionFn = jest.spyOn(App.methods, 'deleteSubmission');
let confirmationDeleteFn = jest.spyOn(App.methods, 'confirmationDelete');
let toggleSubmissionFormFn = jest.spyOn(App.methods, 'toggleSubmissionForm');
let createNewSubmissionFn = jest.spyOn(App.methods, 'createNewSubmission');
let editSubmissionSubmitFn = jest.spyOn(App.methods, 'editSubmissionSubmit');

describe('App', () => {
	
    beforeEach(async () => {
        jest.clearAllMocks();

        wrapper = mount(App);

        await flushPromises();
    });

    it('App renders', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Calls on the formatter function', () => {
        expect(formatter).toHaveBeenCalledTimes(1);
    });

    it('Calls on the form function', () => {
        expect(formTypes).toHaveBeenCalledTimes(1);
    });

    test('It Renders the SubmissionsTable', async () => {
        await wrapper.setData({
            data: dummyData,
            formSelectOptions: formJson
        });
        expect(wrapper.findComponent(SubmissionsTable).exists()).toBe(true);
    });

    it('Makes a request when the page is created', async () =>
        submissionCall.mockResolvedValueOnce(json));

    it('Uses the formated json data', async () => {
        let formatedData = await formatter();
        expect(wrapper.vm.data).toEqual(formatedData);
    });

    it('Deletes emited component', async () => {
        await wrapper.setData({
            data: dummyData,
            formSelectOptions: formJson
        });
        let table = wrapper.findComponent(SubmissionsTable);
        expect(wrapper.vm.submissionIndexedForDeletion).toBeNull();
        expect(wrapper.vm.data[3].name).toEqual('Nicole');

        await table.vm.$emit('delete-this-submission', 3);

        expect(wrapper.vm.submissionIndexedForDeletion).toBe(3);
        expect(confirmationDeleteFn).toBeCalled();
        expect(wrapper.vm.deleteModal).toBe(true);
        expect(wrapper.find('[data-testid="delete-modal-component"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="confirm-delete-button"]').exists()).toBe(true);
        
        await wrapper.find('[data-testid="confirm-delete-button"]').trigger('click');
        
        expect(deleteSubmissionFn).toBeCalled();
        //Ivana previously was at index 4 and after the deletion of Nicole she drops to index 3
        expect(wrapper.vm.data[3].name).toEqual('Ivana Trajkova');
    });

    test('It renders the SubmissionForm', async () => {
        await wrapper.setData({
            data: dummyData,
            formSelectOptions: formJson,
            submissionForm: false
        });
        expect(wrapper.findComponent(SubmissionForm).exists()).toBe(false);
        wrapper.find('[data-testid="create-submission-button"]').trigger('click');
        await expect(wrapper.findComponent(SubmissionsTable).emitted('create-new-submission')).toBeTruthy();
        expect(toggleSubmissionFormFn).toBeCalled();
        expect(wrapper.findComponent(SubmissionForm).exists()).toBe(true);
    });

    test('Submits and adds the new submission', async () => {
        await wrapper.setData({
            data: dummyData,
            formSelectOptions: formJson,
            showSubmissionForm: true
        });
        let createdSubmission = {
            name: 'Goran',
            email: 'Goran@goan.com',
            recommendation: 'yes',
            feedback: 'no feedback whatsoever',
            date: '11/11/2020',
            form: {
                name: 'Form 1',
                form_type: 'popup'
            },
            status: 'pending'
        };
        let submissionForm = wrapper.findComponent(SubmissionForm);
        await submissionForm.vm.$emit('create-new-submission', createdSubmission);
        expect(createNewSubmissionFn).toBeCalled();
        expect(wrapper.vm.data[0].name).toEqual('Goran');
        expect(wrapper.vm.data[0].email).toEqual('Goran@goan.com');
        expect(wrapper.vm.data[0].recommendation).toEqual('yes');
        expect(wrapper.vm.data[0].feedback).toEqual('no feedback whatsoever');
        expect(wrapper.vm.data[0].form).toEqual('Form 1');
        expect(wrapper.vm.data[0].form_type).toEqual('popup');
        expect(wrapper.vm.data[0].status).toEqual('pending');
    });

    it('Changes the edited submission', async () => {
        await wrapper.setData({
            data: dummyData,
            formSelectOptions: formJson,
            showSubmissionForm: true
        });
        let editedSubmission = {
            name: 'Goran',
            email: 'Goran@goan.com',
            recommendation: 'yes',
            feedback: 'no feedback whatsoever',
            date: '11/11/2020',
            form: {
                name: 'Form 1',
                form_type: 'popup'
            },
            status: 'pending'
        };
        expect(wrapper.vm.data[2]).toEqual({
            name: 'Ivona Atanasova',
            email: 'ivana_ar@example.com',
            recommendation: 'maybe',
            feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non enim gravida ante feugiat fermentum in vitae sem. Mauris ligula ante, finibus quis conva',       
            date: '10/11/2020',
            form: 'Form 2',
            form_type: 'page',
            status: 'approved'
          });
        let submissionForm = wrapper.findComponent(SubmissionForm);
        await submissionForm.vm.$emit('edit-the-submission', editedSubmission, 2);
        expect(editSubmissionSubmitFn).toBeCalled();
        expect(wrapper.vm.data[2]).toEqual({
            name: 'Goran',
            email: 'Goran@goan.com',
            recommendation: 'yes',
            feedback: 'no feedback whatsoever',
            date: '11/11/2020',
            form: 'Form 1',
            status: 'pending',
            form_type: 'popup'
        });
    });
});
