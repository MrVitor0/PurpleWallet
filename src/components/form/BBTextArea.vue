<template>
    <textarea
        :id="inputId"
        :maxlength="maxlength"
        :type="type"
        :class="inputClasses"
        :placeholder="placeholder"
        @focus="isFocused = true"
        @blur="isFocused = false"
        v-model="inputValue"
    />
  </template>
  
  <script>

  export default {
    props: {
      label: String,
      placeholder: String,
      maxlength: {
        type: Number,
        default: 150,
      },
      type: {
        type: String,
        default: 'text',
      },
      icon: {
        type: String,
        default: 'user',
      },
      value: String,
    },
    data() {
      return {
        isFocused: false,
        inputValue: this.value,
      };
    },
    computed: {
      inputClasses() {
        return [
          'border resize-none border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:border-purple-500 pl-10 pr-4 focus:outline-none',
          this.isFocused ? 'focus:border-purple-500' : 'border-gray-300',
        ];
      },
      inputId() {
        return `input-${Math.random().toString(36).substring(2, 10)}`;
      },
    },
    watch: {
      inputValue(newValue) {
        this.$emit('input', newValue);
      },
    },
  };
  </script>
  