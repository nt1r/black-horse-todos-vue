import TodoLocalStorage from "../../src/models/TodoLocalStorage";
import Todo from "../../src/models/Todo";

describe('Local Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add new todo', () => {
    const storage = new TodoLocalStorage();
    storage.create('cooking');

    const todos: Todo[] = storage.getTodos();
    expect(todos.length).toBe(1);
    expect(todos[0].id).toBe(1);
    expect(todos[0].isCompleted).toBeFalsy();
    expect(todos[0].content).toBe('cooking');
    expect(storage.generatedId).toBe(2);
  });

  it('should find todo by id', () => {
    const storage = new TodoLocalStorage();
    storage.create('cooking');
    storage.create('running');

    const targetTodo = storage.find(2);

    expect(targetTodo.id).toBe(2);
    expect(targetTodo.content).toBe('running');
    expect(targetTodo.isCompleted).toBe(false);
  });

  it('should throw error when find todo by id but id not exist', () => {
    const storage = new TodoLocalStorage();
    storage.create('cooking');
    storage.create('running');

    expect(() => {
      storage.find(100);
    }).toThrowError('Todo id not exist.');
  });

  it('should update todo status', function () {
    const storage = new TodoLocalStorage();
    storage.create('cooking');
    const targetTodo = storage.find(1);

    expect(targetTodo.isCompleted).toBe(false);

    targetTodo.isCompleted = true;
    storage.update(1, targetTodo);

    expect(targetTodo.isCompleted).toBe(true);
  });

  it('should delete todo by id', function () {
    const storage = new TodoLocalStorage();
    storage.create('cooking');
    storage.create('running');

    expect(storage.getTodos().length).toBe(2);

    storage.delete(2);

    expect(storage.getTodos().length).toBe(1);
    expect(storage.getTodos()[0].id).toBe(1);
    expect(storage.getTodos()[0].content).toBe('cooking');
  });
});
