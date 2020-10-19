import {createLocalVue, shallowMount} from '@vue/test-utils'
import Vuex, {MutationTree} from 'vuex'
import TodoList from "@/components/TodoList.vue";

const localVue = createLocalVue()

localVue.use(Vuex)

const factory = (values = {}) => {
  return shallowMount(TodoList, {
    data () {
      return {
        ...values
      }
    }
  });
}

describe('TodoList', () => {
  const mockAddNewTodo = jest.fn();
  const mutations = {
    addNewTodo: mockAddNewTodo,
  };
  const mockCommit = jest.fn();

  let store = new Vuex.Store({
    mutations,
  });

  beforeEach(() => {
    mockAddNewTodo.mockClear();
  });

  it('should render a title and a input by default', function () {
    const wrapper = factory();
    expect(wrapper.get('.todo-title')).toBeTruthy();
    expect(wrapper.find('.todo-title').text()).toEqual('todos');
    expect(wrapper.get('input')).toBeTruthy();
    expect(wrapper.get('.todo-main-input')).toBeTruthy();
  });

  it('should double-bind input view and view-model', function () {
    const wrapper = factory();
    const input = wrapper.find('input');
    input.setValue('cooking');

    expect(wrapper.vm.$data.inputText).toBe('cooking');
  });

  it('should commit addNewTodo when user press ENTER in input', function () {
    const wrapper = shallowMount(TodoList, { store, localVue })
    const input = wrapper.find('input');
    input.setValue('cooking');
    input.trigger('keypress', {
      key: 'Enter',
    });

    expect(mockAddNewTodo).toHaveBeenCalledTimes(1);
    expect(mockAddNewTodo).toHaveBeenCalledWith(expect.anything(), 'cooking');
  });

  it('should not commit addNewTodo when user press ENTER in input and content is empty', function () {
    const wrapper = shallowMount(TodoList, { store, localVue })
    const input = wrapper.find('input');
    input.setValue('');
    input.trigger('keypress', {
      key: 'Enter',
    });

    expect(mockAddNewTodo).toHaveBeenCalledTimes(0);
  });
})
