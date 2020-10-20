import Todo from '@/models/Todo';
import TodoVM from '@/view-model/TodoVM';

export default class Convertor {
  static convertTodo2TodoVM(todos: Todo[]) {
    return todos.map((todo) => new TodoVM(todo.id, todo.content, todo.isCompleted));
  }
}
