import Vuex from 'vuex';
import Vue from 'vue';
import Todo from '@/models/Todo';

Vue.use(Vuex);

class Manager {
  todos: Todo[];

  autoIncreasedId: number;

  constructor() {
    this.todos = [];
    this.autoIncreasedId = 1;
  }

  addNewTodo(content: string) {
    this.todos.push(new Todo(this.autoIncreasedId, content));
    this.autoIncreasedId += 1;
  }
}

export default Manager;
