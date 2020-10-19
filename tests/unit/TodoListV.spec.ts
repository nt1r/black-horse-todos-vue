import {createLocalVue, shallowMount} from '@vue/test-utils'
import Vuex from 'vuex'
import TodoList from "@/components/TodoList.vue";
import Todo from "@/models/Todo";
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
    store = new Vuex.Store<StoreInterface>({
      state: {
        autoIncreasedId: 1,
        todos: [],
      },
      mutations,
    });
    wrapper = shallowMount(TodoList, { store, localVue, stubs: ['router-link'] });
  });

  it('should render a title and a input by default', function () {
    expect(wrapper.find('.logo-title').exists()).toBeTruthy();
    expect(wrapper.find('.logo-title').text()).toEqual('todos');

    expect(wrapper.find('.main__input').exists()).toBeTruthy();
  });

  it('should render a placeholder when there is no todo', function () {
    expect(wrapper.find('.main__ul__li').exists()).toBeFalsy();
    expect(wrapper.find('.main__no-content__placeholder').exists()).toBeTruthy();
  });

  it('should render a filter div by default', function () {
    expect(wrapper.find('.main__filter').exists()).toBeTruthy();
    expect(wrapper.find('.main__filter__ul').exists()).toBeTruthy();
    expect(wrapper.findAll('.todo-main-filter-ul-li').length).toBe(3);
    expect(wrapper.findAll('.todo-main-filter-ul-li').at(0).text()).toBe('All');
    expect(wrapper.findAll('.todo-main-filter-ul-li').at(1).text()).toBe('Active');
    expect(wrapper.findAll('.todo-main-filter-ul-li').at(2).text()).toBe('Completed');
  });

  it('should render a list when todo exists', function () {
    store.state.todos.push(new Todo(1, 'cooking'));
    wrapper = shallowMount(TodoList, { store, localVue, stubs: ['router-link'] });

    expect(wrapper.find('.main__ul').exists()).toBeTruthy();
    expect(wrapper.find('#checkbox').exists()).toBeTruthy();
    expect(wrapper.find('.main__ul__li__label__content--uncompleted').exists()).toBeTruthy();
    expect(wrapper.find('.main__ul__li__label__content--uncompleted').text()).toBe('cooking');
  });

  it('should render filter correctly when exists one todo', function () {
    store.state.todos.push(new Todo(1, 'cooking'));
    wrapper = shallowMount(TodoList, { store, localVue, stubs: ['router-link'] });

    expect(wrapper.find('.main__filter__count').exists()).toBeTruthy();
    expect(wrapper.find('.main__filter__count').text()).toBe('1 item left');
    expect(wrapper.find('.main__filter__tail').exists()).toBeFalsy();
  });

  it('should render filter correctly when exists two or more todos', function () {
    store.state.todos.push(new Todo(1, 'cooking'));
    store.state.todos.push(new Todo(2, 'running'));
    wrapper = shallowMount(TodoList, { store, localVue, stubs: ['router-link'] });

    expect(wrapper.find('.main__filter__count').exists()).toBeTruthy();
    expect(wrapper.find('.main__filter__count').text()).toBe('2 items left');
    expect(wrapper.find('.main__filter__tail').exists()).toBeFalsy();
  });
})
