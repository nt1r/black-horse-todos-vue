<template>
  <label>
    <input
      class="main__input"
      type="text"
      placeholder="What needs to be done?"
      v-model=inputText
      @keypress.enter="onInputKeyPress"
    />
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '../store';

export default Vue.extend({
  data() {
    return {
      name: 'TodoCreator',
      inputText: '',
    };
  },
  methods: {
    onInputKeyPress() {
      if (this.inputText !== '') {
        store.commit({
          type: 'addNewTodo',
          content: this.inputText,
        });
        this.inputText = '';
        this.refreshPage();
      }
    },

    refreshPage() {
      store.commit({
        type: 'refreshTodos',
      });
    },
  },
});
</script>

<style scoped lang="scss">
@use '../styles/_variable';

.main__input {
  padding: 1.6 * variable.$base-padding 1.6 * variable.$base-padding 1.6 * variable.$base-padding 6.2 * variable.$base-padding;
  font-size: variable.$todo-font-size;
  font-family: inherit;
  font-weight: inherit;
  width: variable.$todo-width;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
  border: none;
}

.main__input::placeholder {
  color: lightgray;
  font-style: italic;
}

.main__input:focus {
  outline: none;
}
</style>
