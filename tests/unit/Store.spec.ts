import store from '@/store/index'
import {Filter} from "@/view-model/Filter";
import {mockAddNewTodo} from "../../__mocks__/Manager";
import Manager from "@/models/Manager";
import {mocked} from "ts-jest/utils";
import Todo from "@/models/Todo";

jest.mock('../../src/models/Manager');

describe('Store', () => {
  beforeEach(() => {
    store.state.filter = Filter.All;
    store.state.todos = [];
    store.state.filteredTodos = [];

    mocked(Manager).mockImplementation(() => {
      return {
        todos: [],
        autoIncreasedId: 1,
        addNewTodo: mockAddNewTodo,
      }
    });
    store.state.manager = new Manager();
  });

  it('should add new todo', function () {
    mocked(Manager).mockImplementation(() => {
      return {
        todos: [new Todo(1, 'cooking')],
        autoIncreasedId: 2,
        addNewTodo: mockAddNewTodo,
      }
    });
    store.state.manager = new Manager();

    store.commit('addNewTodo', 'cooking');

    expect(mockAddNewTodo).toHaveBeenCalledTimes(1);
    expect(mockAddNewTodo).toHaveBeenCalledWith('cooking');
    expect(store.state.todos).toHaveLength(1);
    expect(store.state.todos[0].id).toBe(1);
    expect(store.state.todos[0].content).toBe('cooking');
    expect(store.state.todos[0].isCompleted).toBe(false);
  });

  it('should update filtered all todos', function () {
    mocked(Manager).mockImplementation(() => {
      return {
        todos: [
          new Todo(1, 'cooking', false),
          new Todo(2, 'running', true),
          new Todo(3, 'swimming', false),
        ],
        autoIncreasedId: 4,
        addNewTodo: mockAddNewTodo,
      }
    });
    store.state.manager = new Manager();
    store.state.filter = Filter.All;

    store.commit('updateFilteredTodos');

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
    mocked(Manager).mockImplementation(() => {
      return {
        todos: [
          new Todo(1, 'cooking', false),
          new Todo(2, 'running', true),
          new Todo(3, 'swimming', false),
        ],
        autoIncreasedId: 4,
        addNewTodo: mockAddNewTodo,
      }
    });
    store.state.manager = new Manager();
    store.state.filter = Filter.Active;

    store.commit('updateFilteredTodos');

    expect(store.state.filteredTodos).toHaveLength(2);
    expect(store.state.filteredTodos[0].id).toBe(1);
    expect(store.state.filteredTodos[0].content).toBe('cooking');
    expect(store.state.filteredTodos[0].isCompleted).toBe(false);
    expect(store.state.filteredTodos[1].id).toBe(3);
    expect(store.state.filteredTodos[1].content).toBe('swimming');
    expect(store.state.filteredTodos[1].isCompleted).toBe(false);
  });

  it('should update filtered completed todos', function () {
    mocked(Manager).mockImplementation(() => {
      return {
        todos: [
          new Todo(1, 'cooking', false),
          new Todo(2, 'running', true),
          new Todo(3, 'swimming', false),
        ],
        autoIncreasedId: 4,
        addNewTodo: mockAddNewTodo,
      }
    });
    store.state.manager = new Manager();
    store.state.filter = Filter.Completed;

    store.commit('updateFilteredTodos');

    expect(store.state.filteredTodos).toHaveLength(1);
    expect(store.state.filteredTodos[0].id).toBe(2);
    expect(store.state.filteredTodos[0].content).toBe('running');
    expect(store.state.filteredTodos[0].isCompleted).toBe(true);
  });
})
