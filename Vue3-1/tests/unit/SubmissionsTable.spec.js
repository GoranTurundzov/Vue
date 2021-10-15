import { mount } from '@vue/test-utils';
import SubmissionsTable from '@/components/SubmissionsTable';
import SubmissionsTableRow from '@/components/SubmissionsTableRow';
import dummyData from '../../src/assets/DummyData';
import Modal from '../../src/components/Modal';
import formJson from '../../public/forms.json';
import SubmissionTableFilter from '../../src/components/SubmissionTableFilter';

let wrapper;
let spySubmitFilterFn = jest.spyOn(SubmissionsTable.methods, 'submitFilter');
let spyToggleFilterFn = jest.spyOn(SubmissionsTable.methods, 'toggleFilter');
let spyLoadMoreFn = jest.spyOn(SubmissionsTable.methods, 'loadMore');
let spyPostsPerPageFn = jest.spyOn(SubmissionsTable.methods, 'postsPerPage');
let spyTriggerModalFn = jest.spyOn(SubmissionsTable.methods, 'triggerModal');
let spyStockFilterFn = jest.spyOn(SubmissionsTable.methods, 'stockFilter');
let spyDeleteSubmissionFn = jest.spyOn(SubmissionsTable.methods, 'deleteSubmission');

describe('SubmissionsTable', () => {
    beforeEach(() => {
        wrapper = mount(SubmissionsTable, {
            propsData: {
                tableData: dummyData,
                formSelectOptions: formJson
            }
        });
    });

    it('Matches snapshot', () => expect(wrapper.element).toMatchSnapshot());

    it('Renders the right number of rows and button dissappears', async () => {
        let submissionsRows = wrapper.findAllComponents(SubmissionsTableRow);

        expect(submissionsRows).toHaveLength(wrapper.vm.rowsToLoad * wrapper.vm.timesLoaded);

        let button = wrapper.find('[data-testid="test-load-more"]');

        expect(button.exists()).toBeTruthy();
        expect(wrapper.vm.timesLoaded).toEqual(1);

        await button.trigger('click');
        expect(spyLoadMoreFn).toBeCalled();
        expect(wrapper.vm.timesLoaded).toEqual(2);
        expect(wrapper.vm.showButton).toBeTruthy();

        await button.trigger('click');
        expect(spyLoadMoreFn).toBeCalled();
        expect(wrapper.vm.showButton).toBeTruthy();
        expect(wrapper.vm.timesLoaded).toEqual(3);

        await button.trigger('click');
        expect(spyLoadMoreFn).toBeCalled();
        expect(wrapper.vm.showButton).toBeTruthy();
        expect(wrapper.vm.timesLoaded).toEqual(4);

        await button.trigger('click');
        expect(spyLoadMoreFn).toBeCalled();
        expect(wrapper.vm.timesLoaded).toEqual(5);
        expect(wrapper.vm.showButton).toBeFalsy();
    });

    test('It Renders the Table rows', () => {
        expect(wrapper.findComponent(SubmissionsTableRow).exists()).toBe(true);
    });

    test('Number of posts change when option is changed', async () => {
        await wrapper.findAll('option')[1].setSelected();
        expect(spyPostsPerPageFn).toBeCalled();
        expect(wrapper.findAllComponents(SubmissionsTableRow)).toHaveLength(
            parseInt(wrapper.vm.rowsToLoad)
        );

        await wrapper.find('[data-testid="test-load-more"]').trigger('click');
        expect(spyLoadMoreFn).toBeCalled();
        expect(wrapper.findAllComponents(SubmissionsTableRow)).toHaveLength(
            wrapper.vm.rowsToLoad * 2
        );
    });

    test('Loads the modal with data', async () => {
        expect(wrapper.vm.modalActive).toBe(false);
        expect(wrapper.vm.modalData).toBeNull();
        expect(wrapper.findComponent(Modal).exists()).toBe(false);

        let component = wrapper.findAllComponents(SubmissionsTableRow)[2];

        await component.find('[data-testid="modal-activator"]').trigger('click');
        expect(spyTriggerModalFn).toBeCalled();
        expect(wrapper.vm.modalActive).toBe(true);
        expect(wrapper.vm.modalData).not.toBeNull();
        expect(wrapper.findComponent(Modal).exists()).toBe(true);

        let modalWrapper = mount(Modal, {
            slots: {
                default: '<div>' + wrapper.vm.modalData.form_type + '</div>'
            }
        });
        expect(modalWrapper.find('.block-content').html()).toContain('<div>page</div>');
    });

    test('Filter Data Works', async () => {
        let testFilters = {
            form: 'Form 1',
            form_type: 'All',
            recommendation: 'Yes',
            date: 'Month to date',
            status: 'pending'
        };

        await wrapper.setData({
            appliedFilters: testFilters
        });

        let filteredObjectToBeFound = {
            name: 'Ivana Trajkova',
            email: 'ivana_tr@example.com',
            recommendation: 'yes',
            feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non enim gravida ante feugiat fermentum in vitae sem. Mauris ligula ante, finibus quis convallis eget, auctor vehicula massa. Nunc arcu lectus, viverra ac enim eu, suscipit fermentum sapien. Nam maximus facilisis enim sit amet tempor. Curabitur at euismod augue, et aliquet elit. Mauris dui libero, consequat sit amet lacus sit amet, vulputate interdum tellus. Morbi condimentum porttitor ornare.',
            date: '03/10/2021',
            form: 'Form 1',
            form_type: 'popup',
            status: 'pending'
        };
        expect(wrapper.vm.loadedSubmissions[0]).toEqual(filteredObjectToBeFound);
    });

    test('on filter change it stocks filters', async () => {
        await wrapper.setData({
            filterModal: true
        });
        await wrapper.findComponent(SubmissionTableFilter).trigger('change-filter');
        expect(spyStockFilterFn).toBeCalled();
    });

    test('Activates filter(toggleFilter) modal and submits filters', async () => {
        wrapper.setData({
            appliedFilters: {
                form: 'All',
                form_type: 'All',
                recommendation: 'All',
                date: 'All',
                status: 'All'
            },
            selectedFilters: {
                form_type: 'Email',
                recommendation: 'All',
                date: 'Today',
                status: 'All',
                form: 'All'
            }
        });
        expect(wrapper.vm.filterModal).toBe(false);

        await wrapper.find('[data-testid="open-filters-button"]').trigger('click');
        expect(spyToggleFilterFn).toBeCalled();
        expect(wrapper.vm.filterModal).toBe(true);

        await wrapper.find('[data-testid="submit-filters-button"]').trigger('click');
        expect(spySubmitFilterFn).toBeCalled();
        expect(wrapper.vm.appliedFilters).toEqual(wrapper.vm.selectedFilters);
    });

    test('submission-table-filter recieves correct values as props', async () => {
        wrapper.setData({
            appliedFilters: {
                form: 'All',
                form_type: 'Email',
                recommendation: 'Maybe',
                date: 'All',
                status: 'Approved'
            }
        });

        await wrapper.find('[data-testid="open-filters-button"]').trigger('click');

        expect(spyToggleFilterFn).toBeCalled();
        expect(wrapper.findComponent(SubmissionTableFilter).exists()).toBe(true);
        expect(wrapper.findComponent(SubmissionTableFilter).vm.form).toEqual('All');
        expect(wrapper.findComponent(SubmissionTableFilter).vm.form_type).toEqual('Email');
        expect(wrapper.findComponent(SubmissionTableFilter).vm.recommendation).toEqual('Maybe');
        expect(wrapper.findComponent(SubmissionTableFilter).vm.date).toEqual('All');
        expect(wrapper.findComponent(SubmissionTableFilter).vm.status).toEqual('Approved');
    });

    it('Listenes to the event emmited by the row component and emmits new event', () => {
        let randomRowComponent = wrapper.findAllComponents(SubmissionsTableRow)[3];
        randomRowComponent.find('[ data-testid="delete-activator"]').trigger('click');
        expect(spyDeleteSubmissionFn).toBeCalled();
        expect(wrapper.emitted('delete-this-submission')).toBeTruthy();
        expect(wrapper.emitted('delete-this-submission')).toHaveLength(1);
        expect(wrapper.emitted('delete-this-submission')[0][0]).toEqual(3);
    });

    test('on filter change it stocks filters', async () => {
        await wrapper.setData({
            filterModal: true
        });
        await wrapper.findComponent(SubmissionTableFilter).trigger('change-filter');
        expect(spyStockFilterFn).toBeCalled();
    });
});
