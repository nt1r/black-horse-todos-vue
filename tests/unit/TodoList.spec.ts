import {createLocalVue, shallowMount} from '@vue/test-utils'
import Vuex from 'vuex'
import TodoList from "@/components/TodoList.vue";
import Todo from "@/models/Todo";
import store from '@/store/index'
import {Filter} from "@/view-model/Filter";
import TodoVM from "@/view-model/TodoVM";
import Manager from "@/models/Manager";

const localVue = createLocalVue();

localVue.use(Vuex);

describe('TodoList', () => {
  let wrapper = shallowMount(TodoList, { store, localVue, stubs: ['router-link'] });

  beforeEach(() => {
    store.state.todos = [];
    store.state.filteredTodos = [];
    store.state.filter = Filter.All;
    store.state.manager = new Manager();
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
    store.state.filteredTodos.push(new TodoVM(1, 'cooking'));
    wrapper = shallowMount(TodoList, { store, localVue, stubs: ['router-link'] });

    expect(wrapper.find('.main__ul').exists()).toBeTruthy();
    expect(wrapper.find('.main__ul__li__label__content--uncompleted').exists()).toBeTruthy();
    expect(wrapper.find('.main__ul__li__label__content--uncompleted').text()).toBe('cooking');
  });

  it('should render filter correctly when exists one todo', function () {
    store.state.filteredTodos.push(new TodoVM(1, 'cooking'));
    wrapper = shallowMount(TodoList, { store, localVue, stubs: ['router-link'] });

    expect(wrapper.find('.main__filter__count').exists()).toBeTruthy();
    expect(wrapper.find('.main__filter__count').text()).toBe('1 item left');
    expect(wrapper.find('.main__filter__tail').exists()).toBeFalsy();
  });

  it('should render filter correctly when exists two or more todos', function () {
    store.state.filteredTodos.push(new TodoVM(1, 'cooking'));
    store.state.filteredTodos.push(new TodoVM(2, 'running'));
    wrapper = shallowMount(TodoList, { store, localVue, stubs: ['router-link'] });

    expect(wrapper.find('.main__filter__count').exists()).toBeTruthy();
    expect(wrapper.find('.main__filter__count').text()).toBe('2 items left');
    expect(wrapper.find('.main__filter__tail').exists()).toBeFalsy();
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

    expect(wrapper.vm.$store.state.todos).toHaveLength(1);
    expect(wrapper.vm.$store.state.filteredTodos).toHaveLength(1);
    expect(store.state.filteredTodos[0].id).toBe(1);
    expect(store.state.filteredTodos[0].content).toBe('cooking');
    expect(store.state.filteredTodos[0].isCompleted).toBe(false);

    expect(store.state.manager.todos).toHaveLength(1);
  });

  it('should not commit addNewTodo when user press ENTER in input and content is empty', function () {
    const input = wrapper.find('.main__input');
    input.setValue('');
    input.trigger('keypress', {
      key: 'Enter',
    });

    expect(wrapper.vm.$store.state.todos).toHaveLength(0);
    expect(wrapper.vm.$store.state.filteredTodos).toHaveLength(0);

    expect(store.state.manager.todos).toHaveLength(0);
  });

  it('should change todo status', function () {
    wrapper.vm.$store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    wrapper.vm.$store.commit({
      type: 'setTodoStatus',
      id: 1,
      isCompleted: true,
    });
    wrapper.vm.$store.commit({
      type: 'updateTodos',
    });

    expect(wrapper.vm.$store.state.todos[0].isCompleted).toBe(true);

    wrapper.vm.$store.commit({
      type: 'setTodoStatus',
      id: 1,
      isCompleted: false,
    });
    wrapper.vm.$store.commit({
      type: 'updateTodos',
    });

    expect(wrapper.vm.$store.state.todos[0].isCompleted).toBe(false);
  });
})
