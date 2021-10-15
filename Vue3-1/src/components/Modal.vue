<template>
    <div @click.self="closeModal" class="modal out">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="block-header bg-primary-darker">
                    <ul class="block-options">
                        <li>
                            <button type="button" @click="closeModal" data-testid="x-button">
                                <i class="fa fa-times"></i>
                            </button>
                        </li>
                    </ul>
                    <slot name="header"></slot>
                </div>
                <div class="block-content">
                    <slot></slot>
                </div>
                <div class="modal-footer" v-if="footerSlotPassed">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    emits: ['close-modal'],
    computed: {
        footerSlotPassed() {
            return this.$slots['footer'];
        }
    },
    methods: {
        closeModal() {
            this.$emit('close-modal');
        }
    }
};
</script>

<style scoped>
.out {
    background-color: rgba(7, 7, 7, 0.7);
    display: block;
    z-index: 2;
}
.modal-dialog {
    max-height: 92vh;
    overflow: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.modal-dialog::-webkit-scrollbar {
    display: none;
}
</style>
