<template>
    <transition name="modal" appear v-if="isInputModalVisible" @close="hideModal">
      <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
        <div class="bg-white rounded-2xl w-full sm:max-w-5xl">
          <slot></slot>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  
  import { mapState, mapActions } from 'vuex';
  export default {
    name: 'BBModal',
    computed: {
        ...mapState('modal', ['isInputModalVisible'])
    },
    methods: {
      ...mapActions('modal', ['showInputModal', 'hideInputModal']),
    }
  }
  </script>
  
  <style scoped>
  .modal-enter-active, .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  .modal-enter, .modal-leave-to {
    opacity: 0;
  }
  </style>
  