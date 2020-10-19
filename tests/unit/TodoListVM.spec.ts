import {createLocalVue, shallowMount} from '@vue/test-utils'
import Vuex from 'vuex'
import TodoList from "@/components/TodoList.vue";
import {StoreInterface} from "@/store";

const localVue = createLocalVue();

localVue.use(Vuex);

describe('TodoList', () => {
  const mockAddNewTodo = jest.fn();
  const mutations = {
    addNewTodo: mockAddNewTodo,
  };

  let store = new Vuex.Store<StoreInterface>({
    state: {
      autoIncreasedId: 1,
      todos: [],
    },
    mutations,
  });

  let wrapper = shallowMount(TodoList, { store, localVue, stubs: ['router-link'] });

  beforeEach(() => {
    mockAddNewTodo.mockClear();
    store = new Vuex.Store<StoreInterface>({
      state: {
        autoIncreasedId: 1,
        todos: [],
      },
      mutations,
    });
    wrapper = shallowMount(TodoList, { store, localVue, stubs: ['router-link'] });
  });

  it('should double-bind input view and view-model', function () {
    const input = wrapper.find('.main__input');
    input.setValue('cooking');

    expect(wrapper.vm.$data.inputText).toBe('cooking');
  });

  it('should commit addNewTodo when user press ENTER in input', function () {
    const input = wrapper.find('.main__input');
    input.setValue('cooking');
    input.trigger('keypress', {
      key: 'Enter',
    });

    expect(mockAddNewTodo).toHaveBeenCalledTimes(1);
    expect(mockAddNewTodo).toHaveBeenCalledWith(expect.anything(), 'cooking');
  });

  it('should not commit addNewTodo when user press ENTER in input and content is empty', function () {
    const input = wrapper.find('.main__input');
    input.setValue('');
    input.trigger('keypress', {
      key: 'Enter',
    });

    expect(mockAddNewTodo).toHaveBeenCalledTimes(0);
  });
})
