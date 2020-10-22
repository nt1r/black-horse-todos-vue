import Todo from '@/models/Todo';
import TodoVM from '@/store/TodoVM';

export default class Convertor {
  static convertTodo2TodoVM(todos: Todo[]) {
    return todos.map((todo) => new TodoVM(todo.id, todo.content, todo.isCompleted));
  }
}
