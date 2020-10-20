<template>
  <section>
    <header>
      <h1 class="logo-title">todos</h1>
    </header>
    <main class="main">
      <label>
        <input
          class="main__input"
          type="text"
          placeholder="What needs to be done?"
          v-model=inputText
          @keypress=onInputKeyPress
        />
      </label>
      <ul class="main__ul" v-if="this.$store.state.filteredTodos.length > 0">
        <li class="main__ul__li" v-for="todo in this.$store.state.filteredTodos" :key="todo.id">
          <label class="main__ul__li__label">
            <input
              type="checkbox"
              :checked="todo.isCompleted"
              @change="onCheckboxChange($event, todo.id)"
            />
            <span class="main__ul__li__label__empty-span"/>
            <span class="main__ul__li__label__content--completed" v-if="todo.isCompleted">{{ todo.content }}</span>
            <span class="main__ul__li__label__content--uncompleted" v-else>{{ todo.content }}</span>
          </label>
          <button class="main__ul__li__label__delete-button" type="button"></button>
        </li>
      </ul>
      <div class="main__no-content" v-else>
        <span class="main__no-content__placeholder">No contents yet.</span>
      </div>
      <div class="main__filter">
        <span class="main__filter__count">
          {{ this.$store.state.filteredTodos.length }} {{ this.$store.state.filteredTodos.length > 1 ? "items" : "item" }} left
        </span>
        <ul class="main__filter__ul">
          <li class="todo-main-filter-ul-li">
            <router-link class="main__filter__ul__li__link" to="/#/">All</router-link>
          </li>
          <li class="todo-main-filter-ul-li">
            <router-link class="main__filter__ul__li__link" to="/#/active">Active</router-link>
          </li>
          <li class="todo-main-filter-ul-li">
            <router-link class="main__filter__ul__li__link" to="/#/completed">Completed</router-link>
          </li>
        </ul>
        <span class="main__filter__tail" v-if="this.$store.state.isCompletedTodoExists">Clear Completed</span>
      </div>
      <div class="main__fade--first"/>
      <div class="main__fade--second"/>
    </main>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ComponentOptions } from 'vue';

@Component
export default class TodoList extends Vue {
  inputText: string;

  constructor(options: ComponentOptions<Vue>) {
    super(options);
    this.inputText = '';
  }

  onInputKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.inputText !== '') {
      this.$store.commit({
        type: 'addNewTodo',
        content: this.inputText,
      });
      this.inputText = '';
      this.refreshPage();
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

  refreshPage() {
    this.$store.commit({
      type: 'updateTodos',
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@use '../styles/_variable';
@use "../styles/_mixin";

$todo-width: 550px;
$todo-font-size: 24px;

$div-width: $todo-width + 7.6 * variable.$base-padding;
$div-height: 60px;

$icon-size: 20px;

$checkbox-size: 24px;
$check-color: #03fcc6;

$transition-duration: 0.1s;

.logo-title {
  font-size: 100px;
  font-family: inherit;
  font-weight: inherit;
  color: variable.$primary-color;
  margin: variable.$base-margin;
  text-align: center;
}

.main {
  @include mixin.flex-layout(column, flex-start, center, flex-start);
}

.main__input {
  padding: 1.6 * variable.$base-padding 1.6 * variable.$base-padding 1.6 * variable.$base-padding 6.2 * variable.$base-padding;
  font-size: $todo-font-size;
  font-family: inherit;
  font-weight: inherit;
  width: $todo-width;
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

.main__ul {
  @include mixin.flex-layout(column, flex-start, flex-start, flex-start);
  margin: 2px 0 0 0;
  padding: 0;
}

.content-div-basic {
  width: $div-width;
  background-color: white;
  height: $div-height;
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
.main__ul__li input {
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
  font-size: $todo-font-size;
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

.main__no-content__placeholder {
  font-size: $todo-font-size;
  font-style: italic;
  color: lightgray;
  text-align: center;
  width: 100%;
}

.main__filter {
  @include mixin.flex-layout(row, center, center, flex-start);
  @extend .content-div-basic;
  position: relative;
  font-size: 1em;
  border: 1px solid variable.$background-color;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
}

.main__filter__count {
  margin-left: variable.$base-margin;
  position: absolute;
  left: 0;
}

.main__filter__ul {
  display: block;
  @include mixin.flex-layout(row, space-evenly, center, flex-start);
  list-style-type: none;
  width: 200px;
  padding: 0;
}

.main__filter__ul__li__link {
  background: transparent;
  border: none;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 1em;
  font-weight: 100;
  padding: variable.$base-padding / 2;
  text-decoration: none;
  color: black;
}

.main__filter__ul__li__link--selected {
  @extend .main__filter__ul__li__link;
  outline: 2px solid variable.$primary-color;
}

.main__filter__ul__li__link:hover {
  outline: 2px solid variable.$primary-color;
  color: black;
}

.main__filter__tail {
  margin-right: variable.$base-margin;
  position: absolute;
  right: 0;
}

.main__filter__tail:hover {
  text-decoration: underline;
  cursor: pointer;
}

.fade-basic {
  background-color: white;
  height: 5px;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
  border: 1px solid variable.$background-color;
}

.main__fade--first {
  @extend .fade-basic;
  width: $div-width * 0.98;
}

.main__fade--second {
  @extend .fade-basic;
  margin-top: 1px;
  width: $div-width * 0.96;
}
</style>
