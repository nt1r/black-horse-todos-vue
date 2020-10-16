<template>
  <section>
    <header>
      <h1 class="todo-title">todos</h1>
    </header>
    <main class="todo-main">
      <label>
        <input
          class="todo-main-input"
          type="text"
          placeholder="What needs to be done?" />
      </label>
    </main>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TodoList extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@use '../styles/_variable';
@use "../styles/_mixin";

.todo-title {
  font-size: 100px;
  font-family: inherit;
  font-weight: inherit;
  color: variable.$primary-color;
  margin: variable.$base-margin;
  text-align: center;
}

.todo-main {
  @include mixin.flex-layout(column, flex-start, center, flex-start);
}

.todo-main-input {
  padding: 1.6 * variable.$base-padding 1.6 * variable.$base-padding 1.6 * variable.$base-padding 6.2 * variable.$base-padding;
  font-size: variable.$todo-font-size;
  font-family: inherit;
  font-weight: inherit;
  width: variable.$todo-width;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.2);
  border: none;
}

.todo-main-input::placeholder {
  color: lightgray;
  font-style: italic;
}

.todo-main-input:focus {
  outline: none;
}
</style>
