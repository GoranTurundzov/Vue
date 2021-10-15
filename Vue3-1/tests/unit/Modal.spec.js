import { mount } from '@vue/test-utils';
import Modal from '@/components/Modal';

let spyCloseModalFn = jest.spyOn(Modal.methods, 'closeModal');

describe('SubmissionModal', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Modal);
    });

    it('Matches snapshot', () => expect(wrapper.element).toMatchSnapshot());

    test('Emitts when clicked outside', async () => {
        await wrapper.find('.out').trigger('click');
        expect(wrapper.emitted('close-modal')).toBeTruthy();
        expect(wrapper.emitted('close-modal').length).toBe(1);
    });

    test('Emmits when clicked on X button', async () => {
        await wrapper.find('[data-testid="x-button"]').trigger('click');
        expect(spyCloseModalFn).toBeCalled();
        expect(wrapper.emitted('close-modal')).toBeTruthy();
        expect(wrapper.emitted('close-modal').length).toBe(1);
    });

    test('prints slot and title prop', () => {
        let slotWrapper = mount(Modal, {
            slots: {
                default: '<div class="test-content">this is in the slot</div>',
                header: '<h3>Test Title</h3>',
                footer: '<p>All rights reserved</p>'
            }
        });
        expect(slotWrapper.find('.block-content').html()).toContain(
            '<div class="test-content">this is in the slot</div>'
        );
        expect(slotWrapper.find('.block-header').html()).toContain('<h3>Test Title</h3>');
        expect(slotWrapper.find('.modal-footer').exists()).toBe(true);
        expect(slotWrapper.find('.modal-footer').html()).toContain('<p>All rights reserved</p>');
    });
});
