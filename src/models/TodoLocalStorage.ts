import Todo from '@/models/Todo';
import { TodoStorageInterface } from "@/store/TodoStorageInterface";

export default class TodoLocalStorage implements TodoStorageInterface {
  generatedId: number;
  constructor() {
    this.generatedId = this.getGeneratedId();
  }

  getGeneratedId(): number {
    const generatedId = localStorage.getItem('generatedId');
    if (generatedId === null) {
      return 1;
    }
    return Number.parseInt(generatedId, 10);
  }

  getTodos(): Todo[] {
    const todos = localStorage.getItem('todos');
    if (todos === null) {
      return [];
    }
    return JSON.parse(todos);
  }

  setGeneratedId() {
    localStorage.setItem('generatedId', this.generatedId.toString());
  }

  setTodos(todos: Todo[]) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  create(content: string): Todo {
    const todos: Todo[] = this.getTodos();
    const todo: Todo = new Todo(this.generatedId, content);
    todos.push(todo);
    this.setTodos(todos);

    this.generatedId += 1;
    this.setGeneratedId();

    return todo;
  }

  delete(id: number) {
    const todos: Todo[] = this.getTodos();
    const targetTodo: Todo = this.find(id);
    const newTodos: Todo[] = [];
    todos.forEach((todo) => {
      if (todo.id !== targetTodo.id) {
        newTodos.push(todo);
      }
    });
    this.setTodos(newTodos);
  }

  find(id: number): Todo {
    const todos: Todo[] = this.getTodos();
    const targetList: Todo[] = todos.filter((todo) => todo.id === id);
    if (targetList.length === 0) {
      throw new Error('Todo id not exist.');
    }
    return targetList[0];
  }

  update(id: number, newTodo: Todo): Todo {
    const todos: Todo[] = this.getTodos();
    for (const todo of todos) {
      if (todo.id === id) {
        todo.content = newTodo.content;
        todo.isCompleted = newTodo.isCompleted;
        break;
      }
    }
    this.setTodos(todos);
    return newTodo;
  }
}
