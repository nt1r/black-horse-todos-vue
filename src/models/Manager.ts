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

  setTodoStatus(id: number, isCompleted: boolean) {
    const targetTodo = this.findTodoById(id);
    targetTodo.isCompleted = isCompleted;
  }

  findTodoById(id: number) {
    const targetList: Todo[] = this.todos.filter((todo) => todo.id === id);
    if (targetList.length === 0) {
      throw new Error('Todo id not exist.');
    }
    return targetList[0];
  }
}

export default Manager;
