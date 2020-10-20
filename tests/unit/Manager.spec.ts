import Manager from "@/models/Manager";

describe('Manager', () => {
  beforeEach(() => {
  })

  it('should add new todo', function () {
    const manager = new Manager();
    manager.addNewTodo('cooking');

    expect(manager.todos.length).toBe(1);
    expect(manager.todos[0].id).toBe(1);
    expect(manager.todos[0].isCompleted).toBeFalsy();
    expect(manager.todos[0].content).toBe('cooking');
    expect(manager.autoIncreasedId).toBe(2);
  });

  it('should find todo by id', function () {
    const manager = new Manager();
    manager.addNewTodo('cooking');
    manager.addNewTodo('running');

    const targetTodo = manager.findTodoById(2);

    expect(targetTodo.id).toBe(2);
    expect(targetTodo.content).toBe('running');
    expect(targetTodo.isCompleted).toBe(false);
  });

  it('should throw error when find todo by id but id not exist', function () {
    const manager = new Manager();
    manager.addNewTodo('cooking');
    manager.addNewTodo('running');

    expect(() => {
      manager.findTodoById(100);
    }).toThrowError('Todo id not exist.');
  });
})
