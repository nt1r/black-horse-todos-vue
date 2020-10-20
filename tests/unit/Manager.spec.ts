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
})
