import Vue from 'vue';
import Vuex from 'vuex';
import TodoVM from '@/view-model/TodoVM';
import { Filter } from '@/view-model/Filter';
import Manager from '@/models/Manager';
import Convertor from '@/view-model/Convertor';

Vue.use(Vuex);

export default new Vuex.Store<StoreInterface>({
  state: {
    todos: [],
    filter: Filter.All,
    filteredTodos: [],
    isCompletedTodoExists: false,
    manager: new Manager(),
  },
  mutations: {
    addNewTodo(state, content: string) {
      state.manager.addNewTodo(content);

      state.todos = Convertor.convertTodo2TodoVM(state.manager.todos);
    },

    updateFilteredTodos(state) {
      switch (state.filter) {
        case Filter.All:
        default:
          state.filteredTodos = state.manager.todos;
          break;
        case Filter.Completed:
          state.filteredTodos = state.manager.todos.filter((todoVM) => todoVM.isCompleted);
          break;
        case Filter.Active:
          state.filteredTodos = state.manager.todos.filter((todoVM) => !todoVM.isCompleted);
          break;
      }
      state.isCompletedTodoExists = state.manager.todos.filter((todoVM) => todoVM.isCompleted).length > 0;
    },
  },
  actions: {},
  modules: {},
});

export interface StoreInterface {
  todos: TodoVM[];
  filter: Filter;
  filteredTodos: TodoVM[];
  isCompletedTodoExists: boolean;
  manager: Manager;
}
