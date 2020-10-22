<template>
  <div>
    <ul class="main__ul" v-if="filteredTodos.length > 0">
      <li class="main__ul__li" v-for="todo of filteredTodos" :key="todo.id">
        <label class="main__ul__li__label" v-if="editingId !== todo.id">
          <input
            type="checkbox"
            :checked="todo.isCompleted"
            @click="onCheckboxChange($event, todo.id)"
          />
          <span class="main__ul__li__label__empty-span"/>
          <span
            @click.right="onRightClickTodoContent($event, todo.id, todo.content)"
            :class="todo.isCompleted ? 'main__ul__li__label__content--completed': 'main__ul__li__label__content--uncompleted'">
              {{ todo.content }}
            </span>
        </label>
        <button
          class="main__ul__li__label__delete-button"
          type="button"
          v-if="editingId !== todo.id"
          @click="onClickDeleteButton($event, todo.id)"></button>
        <label
          class="main__ul__li__editor-label"
          v-if="editingId === todo.id">
          <input
            class="main__ul__li__editor-input"
            type="text"
            @blur="onEditInputBlur"
            @keypress.enter="onEnterEditor($event, todo.id, todo.isCompleted)"
            v-model="editingText"
            :ref="'editor-' + todo.id"
          />
        </label>
      </li>
    </ul>
    <div class="main__no-content" v-else>
      <span class="main__no-content__placeholder">No contents yet.</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ComponentOptions } from 'vue';
import TodoVM from '@/store/TodoVM';
import { Filter } from '@/store/Filter';

@Component
export default class TodoList extends Vue {
  editingId: number;

  editingText: string;

  constructor(options: ComponentOptions<Vue>) {
    super(options);
    this.editingId = -1;
    this.editingText = '';
    this.refreshPage();
  }

  get filteredTodos(): TodoVM[] {
    const currentFilter: Filter = this.filter;
    switch (currentFilter) {
      case Filter.All:
      default:
        return this.$store.state.todos;
      case Filter.Completed:
        return this.$store.state.todos.filter((todoVM: TodoVM) => todoVM.isCompleted);
      case Filter.Active:
        return this.$store.state.todos.filter((todoVM: TodoVM) => !todoVM.isCompleted);
    }
  }

  get filter(): Filter {
    const { hash } = this.$route;
    switch (hash) {
      case '':
      case '#/':
      default:
        return Filter.All;

      case '#/active':
        return Filter.Active;

      case '#/completed':
        return Filter.Completed;
    }
  }

  onCheckboxChange(event: Event, id: number) {
    this.$store.commit({
      type: 'setTodoStatus',
      id,
      isCompleted: event.target.checked,
    });
    this.refreshPage();
  }

  onClickDeleteButton(event: Event, id: number) {
    this.$store.commit({
      type: 'deleteTodo',
      id,
    });
    this.refreshPage();
  }

  onRightClickTodoContent(event: Event, id: number, content: string) {
    this.editingId = id;
    this.editingText = content;

    // 异步更新
    Vue.nextTick(() => {
      this.$refs[`editor-${id}`][0].focus();
    });
    event.preventDefault();
  }

  onEditInputBlur() {
    this.editingId = -1;
  }

  onEnterEditor(event: Event, id: number, isCompleted: boolean) {
    if (this.editingText !== '') {
      this.$store.commit({
        type: 'updateTodoContent',
        id,
        content: this.editingText,
        isCompleted,
      });
      this.onEditInputBlur();
      this.refreshPage();
    } else {
      this.onEditInputBlur();
    }
  }

  refreshPage() {
    this.$store.commit({
      type: 'refreshTodos',
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@use '../styles/_variable';
@use "../styles/_mixin";

$icon-size: 20px;

$checkbox-size: 24px;
$check-color: #03fcc6;

$transition-duration: 0.1s;

.main__ul {
  @include mixin.flex-layout(column, flex-start, flex-start, flex-start);
  margin: 2px 0 0 0;
  padding: 0;
}

.content-div-basic {
  width: variable.$div-width;
  background-color: white;
  height: variable.$div-height;
}

.main__ul__li, .main__no-content {
  @include mixin.flex-layout(row, flex-start, center, flex-start);
  @extend .content-div-basic;
  text-decoration: none;
  border: 1px solid variable.$background-color;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
  margin: 0;
}

/* Hide the browser's default checkbox */
.main__ul__li__label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.main__ul__li__label {
  @include mixin.flex-layout(row, flex-start, center, center);
  padding: 0.5 * variable.$base-padding 0.5 * variable.$base-padding 0.5 * variable.$base-padding 1.5 * variable.$base-padding;
  width: 95%;
  font-size: variable.$todo-font-size;
}

.main__ul__li__label .main__ul__li__label__empty-span {
  height: $checkbox-size;
  width: $checkbox-size;
  background-color: transparent;
  border-radius: 50%;
  border: 2px solid variable.$background-color;
}

.main__ul__li__label input:checked ~ .main__ul__li__label__empty-span {
  height: $checkbox-size;
  width: $checkbox-size;
  background-color: transparent;
  border-radius: 50%;
  border: 2px solid variable.$background-color;
  -webkit-transform: rotate(0deg) scale(1);
  -ms-transform: rotate(0deg) scale(1);
  transform: rotate(0deg) scale(1);
  opacity: 1;
}

.main__ul__li__label .main__ul__li__label__empty-span::after {
  position: absolute;
  content: "";
  left: 12px;
  top: 12px;
  height: 0;
  width: 0;
  border-radius: 5px;
  border: solid $check-color;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(0deg) scale(0);
  -ms-transform: rotate(0deg) scale(0);
  transform: rotate(0deg) scale(0);
  opacity: 1;
  transition: all $transition-duration ease-out;
  -webkit-transition: all $transition-duration ease-out;
  -moz-transition: all $transition-duration ease-out;
  -o-transition: all $transition-duration ease-out;
}

.main__ul__li__label input:checked ~ .main__ul__li__label__empty-span::after {
  -webkit-transform: rotate(45deg) scale(1);
  -ms-transform: rotate(45deg) scale(1);
  transform: rotate(45deg) scale(1);
  opacity: 1;
  left: 8px;
  top: 3px;
  width: 6px;
  height: 12px;
  border: solid $check-color;
  border-width: 0 2px 2px 0;
  background-color: transparent;
  border-radius: 0;
}

.main__ul__li__label__empty-span {
  display: block;
  align-self: center;
  margin-right: variable.$base-margin;
}

.main__ul__li__label__delete-button {
  display: none;
}

.main__ul__li:hover .main__ul__li__label__delete-button {
  display: block;
  align-self: center;
  width: $icon-size;
  height: $icon-size;
  background: url('../assets/close.png');
  border: none;
  margin-right: variable.$base-margin;
}

.main__ul__li__label__content--completed {
  text-decoration: line-through;
  color: lightgray;
}

.main__ul__li__editor-label {

}

.main__ul__li__editor-input {
  width: 506px;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  outline: 1px grey;
  border: 1px solid grey;
  color: inherit;
  padding: 12px 20px;
  margin: 0 0 0 43px;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
}

.main__no-content__placeholder {
  font-size: variable.$todo-font-size;
  font-style: italic;
  color: lightgray;
  text-align: center;
  width: 100%;
}
</style>
