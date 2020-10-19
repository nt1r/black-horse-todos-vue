import Vue from 'vue';
import Vuex from 'vuex';
import Todo from '@/models/Todo';

Vue.use(Vuex);

export default new Vuex.Store<StoreInterface>({
  state: {
    autoIncreasedId: 1,
    todos: [],
  },
  mutations: {
    addNewTodo(state, content: string) {
      state.todos.push(new Todo(state.autoIncreasedId, content));
      state.autoIncreasedId += 1;
    },
  },
  actions: {
  },
  modules: {
  },
});

export interface StoreInterface {
  autoIncreasedId: number;
  todos: Todo[];
}
