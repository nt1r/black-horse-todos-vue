import store from '@/store/index';
import {mocked} from 'ts-jest/utils';
import Todo from '@/models/Todo';
import TodoLocalStorage from "@/models/TodoLocalStorage";
import {
  mockCreate, mockDelete, mockFind,
  mockGetGeneratedId,
  mockGetTodos,
  mockSetGeneratedId,
  mockSetTodos, mockUpdate
} from "../../__mocks__/TodoLocalStorage";

jest.mock('../../src/models/TodoLocalStorage');

function initMockLocalStorage(todos: Todo[]) {
  mocked(TodoLocalStorage).mockImplementation(() => ({
    generatedId: 1,
    getGeneratedId: mockGetGeneratedId,
    setGeneratedId: mockSetGeneratedId,
    getTodos: mockGetTodos,
    setTodos: mockSetTodos,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    find: mockFind,
  }));
  store.state.storage = new TodoLocalStorage();
  mockGetTodos.mockReturnValue(todos);
}

describe('Store', () => {
  beforeEach(() => {
    store.state.todos = [];

    initMockLocalStorage([]);
    mockGetTodos.mockClear();
  });

  it('should update todos from storage', () => {
    initMockLocalStorage([
      new Todo(1, 'cooking', false),
      new Todo(2, 'running', true),
      new Todo(3, 'swimming', false),
    ]);

    store.commit('refreshTodos');

    expect(store.state.todos).toHaveLength(3);
    expect(store.state.todos[0].id).toBe(1);
    expect(store.state.todos[0].content).toBe('cooking');
    expect(store.state.todos[0].isCompleted).toBe(false);
    expect(store.state.todos[1].id).toBe(2);
    expect(store.state.todos[1].content).toBe('running');
    expect(store.state.todos[1].isCompleted).toBe(true);
    expect(store.state.todos[2].id).toBe(3);
    expect(store.state.todos[2].content).toBe('swimming');
    expect(store.state.todos[2].isCompleted).toBe(false);
  });

  it('should add new todo', () => {
    initMockLocalStorage([new Todo(1, 'cooking')]);

    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit('refreshTodos');

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith('cooking');

    expect(store.state.todos).toHaveLength(1);
    expect(store.state.todos[0].id).toBe(1);
    expect(store.state.todos[0].content).toBe('cooking');
    expect(store.state.todos[0].isCompleted).toBe(false);
  });

  it('should change todo status', () => {
    const todo: Todo = new Todo(1, 'cooking');
    initMockLocalStorage([todo]);

    mockFind.mockReturnValue(todo);
    mockUpdate.mockImplementation(() => {
      store.state.todos[0].isCompleted = true;
    })

    store.commit('refreshTodos');
    expect(store.state.todos[0].isCompleted).toBe(false);

    store.commit({
      type: 'setTodoStatus',
      id: 1,
      isCompleted: true,
    });
    store.commit('refreshTodos');

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith(1, expect.anything());
    expect(store.state.todos[0].isCompleted).toBe(true);
  });

  it('should delete todo by id', function () {
    const todoCooking: Todo = new Todo(1, 'cooking');
    const todoRunning: Todo = new Todo(2, 'running');
    initMockLocalStorage([todoCooking, todoRunning]);

    store.commit({
      type: 'deleteTodo',
      id: 2,
    });

    expect(store.state.storage.delete).toHaveBeenCalledTimes(1);
    expect(store.state.storage.delete).toHaveBeenCalledWith(2);
  });

  it('should delete all completed todos', function () {
    const todoCooking: Todo = new Todo(1, 'cooking');
    const todoRunning: Todo = new Todo(2, 'running', true);
    initMockLocalStorage([todoCooking, todoRunning]);

    store.commit({
      type: 'deleteAllCompletedTodos',
    });

    expect(store.state.storage.getTodos).toHaveBeenCalledTimes(1);
    expect(store.state.storage.setTodos).toHaveBeenCalledTimes(1);
    expect(store.state.storage.setTodos).toHaveBeenCalledWith([todoCooking]);
  });

  it('should update todo content', function () {
    const todoCooking: Todo = new Todo(1, 'cooking');
    initMockLocalStorage([todoCooking]);

    store.commit({
      type: 'updateTodoContent',
      id: 1,
      content: 'running',
      isCompleted: false,
    });

    expect(store.state.storage.update).toHaveBeenCalledTimes(1);
    expect(store.state.storage.update).toHaveBeenCalledWith(1, expect.anything());
  });
});
