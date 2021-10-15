import { mount } from '@vue/test-utils';
import SubmissionsTableRow from '@/components/SubmissionsTableRow';
import SubmissionsTableCell from '@/components/SubmissionsTableCell';

let wrapper;

let spyActivateModalFn = jest.spyOn(SubmissionsTableRow.methods, 'activateModal');
let spyDeleteSubmissionFn = jest.spyOn(SubmissionsTableRow.methods, 'deleteSubmission');

describe('SubmissionsTableRow.vue', () => {
    const dataObject = {
        name: 'Jonathan',
        email: 'jonathan@gmail.com',
        recommendation: 'Maybe',
        feedback: 'My neighbor Karly has one of these. She works as a gambler and says it looks tall. I saw one of there in Sparly Islands and I bought One. works ok',
        date: '16/03/2021',
        form: 1,
        form_type: 'page',
        status: 'pending'
    };

    beforeEach(() => {
        wrapper = mount(SubmissionsTableRow, {
            propsData: {
                rowData: dataObject
            }
        });
    });

    it('Matches snapshot', () => expect(wrapper.element).toMatchSnapshot());

    test('It Renders the Table rows', () => {
        expect(wrapper.findComponent(SubmissionsTableCell).exists()).toBe(true);
    });

    it('Renders cells according to data length', () => {
        let cells = wrapper.findAllComponents(SubmissionsTableCell);
        expect(cells).toHaveLength(8);
    });

    test('Preview button emmits activate-modal', () => {
        wrapper.find('[data-testid="modal-activator"]').trigger('click');
        expect(spyActivateModalFn).toBeCalled();
        expect(wrapper.emitted('activate-modal')).toBeTruthy();
        expect(wrapper.emitted('activate-modal').length).toEqual(1);
        expect(wrapper.emitted('activate-modal')[0][0]).toEqual(dataObject);
    });

    test('Delete button (fa-trash) emits when clicked', () => {
        wrapper.find('[data-testid="delete-activator"]').trigger('click');
        expect(spyDeleteSubmissionFn).toBeCalled();
        expect(wrapper.emitted('delete-submission', wrapper.vm.rowData)).toBeTruthy();
        expect(wrapper.emitted('delete-submission')).toHaveLength(1);
        expect(wrapper.emitted('delete-submission')[0][0]).toEqual(dataObject);
    });
});
