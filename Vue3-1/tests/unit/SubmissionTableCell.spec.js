import { mount } from '@vue/test-utils';
import SubmissionsTableCell from '@/components/SubmissionsTableCell';

describe('SubmissionsTableCell', () => {
	let wrapper;

	beforeEach(() => {
		wrapper = mount(SubmissionsTableCell, {
			props: {
				title: 'name',
				text: 'Goran',
				alignInRows: false
			}
		});
	});

	it('Matches snapshot', () => expect(wrapper.element).toMatchSnapshot());

	it('Accepts props', () => {
		let title = wrapper.find('.title');
		let content = wrapper.find('.data-content');

		expect(title.text()).toEqual('name');
		expect(content.text()).toEqual('Goran');
	});
});
