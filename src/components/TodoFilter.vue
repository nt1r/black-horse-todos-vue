<template>
  <div class="center">
    <div class="main__filter">
      <span class="main__filter__count">
        {{ filteredTodos.length }} {{ filteredTodos.length > 1 ? 'items' : 'item' }} left
      </span>
      <ul class="main__filter__ul">
        <li>
          <router-link
            id="all-filter"
            :class="filterStr === 'all' ? 'main__filter__ul__li__link--selected' : 'main__filter__ul__li__link'"
            to="/#/">
            All
          </router-link>
        </li>
        <li>
          <router-link
            id="active-filter"
            :class="filterStr === 'active' ? 'main__filter__ul__li__link--selected' : 'main__filter__ul__li__link'"
            to="/#/active">
            Active
          </router-link>
        </li>
        <li>
          <router-link
            id="completed-filter"
            :class="filterStr === 'completed' ? 'main__filter__ul__li__link--selected' : 'main__filter__ul__li__link'"
            to="/#/completed">
            Completed
          </router-link>
        </li>
      </ul>
      <span
        class="main__filter__tail"
        v-if="isCompletedTodoExists"
        @click="onClickClearCompletedButton">
          Clear Completed
      </span>
    </div>
    <div class="main__fade--first"/>
    <div class="main__fade--second"/>
  </div>
</template>

<script lang="ts">
import TodoVM from '@/store/TodoVM';
import { Filter } from '@/store/Filter';
import Vue from 'vue';
import { Route } from 'vue-router';
import store from '../store';

export default Vue.extend({
  data() {
    return {
      name: 'TodoFilter',
    };
  },

  methods: {
    onClickClearCompletedButton() {
      this.$store.commit({
        type: 'deleteAllCompletedTodos',
      });
      this.refreshPage();
    },

    refreshPage() {
      this.$store.commit({
        type: 'refreshTodos',
      });
    },
  },

  computed: {
    filteredTodos(): TodoVM[] {
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
    },

    filter(): Filter {
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
    },

    filterStr(): string {
      const { hash } = this.$route;
      switch (hash) {
        case '':
        case '#/':
        default:
          return 'all';

        case '#/active':
          return 'active';

        case '#/completed':
          return 'completed';
      }
    },

    isCompletedTodoExists(): boolean {
      let containCompleted = false;
      store.state.todos.some((todoVM: TodoVM) => {
        if (todoVM.isCompleted) {
          containCompleted = true;
          return true;
        }
        return false;
      });
      return containCompleted;
    },
  },
});
</script>

<style scoped lang="scss">
@use '../styles/_variable';
@use "../styles/_mixin";
@use "../styles/_extend";

.center {
  @include mixin.flex-layout(column, flex-start, center, flex-start);
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
  width: variable.$div-width * 0.98;
}

.main__fade--second {
  @extend .fade-basic;
  margin-top: 1px;
  width: variable.$div-width * 0.96;
}
</style>
