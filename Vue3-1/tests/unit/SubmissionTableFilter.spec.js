import { mount } from '@vue/test-utils';
import SubmissionTableFilter from '@/components/SubmissionTableFilter';
import formJson from '../../public/forms.json';

let wrapper;

describe('Filters', () => {
    let spyEmitedFilter = jest.spyOn(SubmissionTableFilter.methods, 'emitFilters');

    beforeEach(() => {
        wrapper = mount(SubmissionTableFilter, {
            props: {
                propForm: 'All',
                propFormType: 'All',
                propStatus: 'All',
                propDate: 'All',
                propRecommendation: 'All',
                formSelectOptions: formJson
            }
        });
    });

    it('Matches snapshot', () => expect(wrapper.element).toMatchSnapshot());

    test('Created assigns values passed from props', async () => {
        expect(wrapper.vm.form_type).toEqual(wrapper.vm.propFormType);
        expect(wrapper.vm.form).toEqual(wrapper.vm.propForm);
        expect(wrapper.vm.status).toEqual(wrapper.vm.propStatus);
        expect(wrapper.vm.recommendation).toEqual(wrapper.vm.propRecommendation);
        expect(wrapper.vm.date).toEqual(wrapper.vm.propDate);
    });

    test('Loads form select options', () => {
        let formName = wrapper.find('[ data-testid="form-name-selector"]');

        expect(formName.findAll('option').length).toBe(8);

        for (let i = 1; i < formName.findAll('option').length; i++) {
            expect(formName.findAll('option')[i].text()).toBe('Form ' + i);
        }
    });

    it('Changes value and calls on the emit function', () => {
        for (let select of wrapper.findAll('select')) {
            select.findAll('option')[1].setSelected();
            expect(spyEmitedFilter).toBeCalled();
        }

        expect(wrapper.emitted('change-filter').length).toBe(5);
        expect(wrapper.emitted('change-filter')).toBeTruthy();
        expect(wrapper.emitted('change-filter')[3][0]).toEqual({
            form: 'Form 1',
            status: 'All',
            date: 'Today',
            recommendation: 'Yes',
            form_type: 'Popup'
        });
    });
});
