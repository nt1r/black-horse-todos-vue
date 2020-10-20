import store from '@/store/index'
import {Filter} from "@/view-model/Filter";
import {mockAddNewTodo, mockFindTodoById, mockSetTodoStatus} from "../../__mocks__/Manager";
import Manager from "@/models/Manager";
import {mocked} from "ts-jest/utils";
import Todo from "@/models/Todo";

jest.mock('../../src/models/Manager');

function initMockManager(todos: Todo[]) {
  mocked(Manager).mockImplementation(() => {
    return {
      todos: todos,
      autoIncreasedId: todos.length + 1,
      addNewTodo: mockAddNewTodo,
      setTodoStatus: mockSetTodoStatus,
      findTodoById: mockFindTodoById,
    }
  });
  store.state.manager = new Manager();
}

describe('Store', () => {
  beforeEach(() => {
    store.state.filter = Filter.All;
    store.state.todos = [];
    store.state.filteredTodos = [];

    initMockManager([]);
  });

  it('should update filtered all todos', function () {
    initMockManager([
      new Todo(1, 'cooking', false),
      new Todo(2, 'running', true),
      new Todo(3, 'swimming', false),
    ]);
    store.state.filter = Filter.All;

    store.commit('updateTodos');

    expect(store.state.filteredTodos).toHaveLength(3);
    expect(store.state.filteredTodos[0].id).toBe(1);
    expect(store.state.filteredTodos[0].content).toBe('cooking');
    expect(store.state.filteredTodos[0].isCompleted).toBe(false);
    expect(store.state.filteredTodos[1].id).toBe(2);
    expect(store.state.filteredTodos[1].content).toBe('running');
    expect(store.state.filteredTodos[1].isCompleted).toBe(true);
    expect(store.state.filteredTodos[2].id).toBe(3);
    expect(store.state.filteredTodos[2].content).toBe('swimming');
    expect(store.state.filteredTodos[2].isCompleted).toBe(false);
  });

  it('should update filtered active todos', function () {
    initMockManager([
      new Todo(1, 'cooking', false),
      new Todo(2, 'running', true),
      new Todo(3, 'swimming', false),
    ]);
    store.state.filter = Filter.Active;

    store.commit('updateTodos');

    expect(store.state.filteredTodos).toHaveLength(2);
    expect(store.state.filteredTodos[0].id).toBe(1);
    expect(store.state.filteredTodos[0].content).toBe('cooking');
    expect(store.state.filteredTodos[0].isCompleted).toBe(false);
    expect(store.state.filteredTodos[1].id).toBe(3);
    expect(store.state.filteredTodos[1].content).toBe('swimming');
    expect(store.state.filteredTodos[1].isCompleted).toBe(false);
  });

  it('should update filtered completed todos', function () {
    initMockManager([
      new Todo(1, 'cooking', false),
      new Todo(2, 'running', true),
      new Todo(3, 'swimming', false),
    ]);
    store.state.filter = Filter.Completed;

    store.commit('updateTodos');

    expect(store.state.filteredTodos).toHaveLength(1);
    expect(store.state.filteredTodos[0].id).toBe(2);
    expect(store.state.filteredTodos[0].content).toBe('running');
    expect(store.state.filteredTodos[0].isCompleted).toBe(true);
  });

  it('should add new todo', function () {
    initMockManager([new Todo(1, 'cooking')]);

    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit('updateTodos');

    expect(mockAddNewTodo).toHaveBeenCalledTimes(1);
    expect(mockAddNewTodo).toHaveBeenCalledWith('cooking');
    expect(store.state.todos).toHaveLength(1);
    expect(store.state.todos[0].id).toBe(1);
    expect(store.state.todos[0].content).toBe('cooking');
    expect(store.state.todos[0].isCompleted).toBe(false);
  });

  it('should change todo status', function () {
    initMockManager([new Todo(1, 'cooking')]);
    // mockSetTodoStatus.mockImplementation(() => {
    //   store.state.todos[0].isCompleted = true;
    // });

    store.commit('updateTodos');
    expect(store.state.todos[0].isCompleted).toBe(false);

    store.commit({
      type: 'setTodoStatus',
      id: 1,
      isCompleted: true,
    });
    store.commit('updateTodos');

    expect(mockSetTodoStatus).toHaveBeenCalledTimes(1);
    expect(mockSetTodoStatus).toHaveBeenCalledWith(1, true);
    // expect(store.state.todos[0].isCompleted).toBe(true);
  });
})
