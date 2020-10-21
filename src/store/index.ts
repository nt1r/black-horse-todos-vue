import Vue from 'vue';
import Vuex from 'vuex';
import TodoVM from '@/view-model/TodoVM';
import Convertor from '@/view-model/Convertor';
import TodoLocalStorage from "@/models/TodoLocalStorage";

Vue.use(Vuex);

// view-model
export default new Vuex.Store<StoreInterface>({
  state: {
    todos: [],
    storage: new TodoLocalStorage(),
  },
  mutations: {
    addNewTodo(state, payload) {
      state.storage.create(payload.content);
    },

    refreshTodos(state) {
      state.todos = Convertor.convertTodo2TodoVM(state.storage.getTodos());
    },

    setTodoStatus(state, payload) {
      const { id, isCompleted } = payload;
      const targetTodo = state.storage.find(id);
      targetTodo.isCompleted = isCompleted;
      state.storage.update(id, targetTodo);

      state.todos = state.storage.getTodos();
    },

    deleteTodo(state, payload) {
      const { id } = payload;
      state.storage.delete(id);
    },

    deleteAllCompletedTodos(state) {
      const activeTodos = state.storage.getTodos().filter((todo) => !todo.isCompleted);
      state.storage.setTodos(activeTodos);
    }
  },
  actions: {},
  modules: {},
});

export interface StoreInterface {
  todos: TodoVM[];
  storage: TodoLocalStorage;
}
