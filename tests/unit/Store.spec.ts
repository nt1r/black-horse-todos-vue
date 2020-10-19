import store from '@/store/index'

describe('Store', () => {
  beforeEach(() => {
    store.state.autoIncreasedId = 1;
    store.state.todos = [];
  })

  it('should add new todo', function () {
    store.commit('addNewTodo', 'cooking');

    expect(store.state.autoIncreasedId).toBe(2);
    expect(store.state.todos).toHaveLength(1);
    expect(store.state.todos[0].id).toBe(1);
    expect(store.state.todos[0].content).toBe('cooking');
    expect(store.state.todos[0].isCompleted).toBeFalsy();
  });
})
