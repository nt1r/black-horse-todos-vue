import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import TodoList from '@/components/TodoList.vue';
import router from "@/router";
import store from '@/store/index';
import TodoLocalStorage from "@/models/TodoLocalStorage";
import Home from "@/views/Home.vue";

const localVue = createLocalVue();

localVue.use(Vuex);

/**
 * 原先的视图组件都放在一个文件TodoList中，导致代码越积越多。因此对该文件进行了重构，把各个小组件拆分到了单独的文件中。
 * 重构之后有关View层的测试用例会有变化，因此测试用例很多无法通过。之后转型Android技术栈，来不及调整过来了。
 */
describe('TodoList', () => {
  let wrapper = shallowMount(Home, { router, store, localVue, stubs: ['router-link'] });

  beforeEach(() => {
    store.state.todos = [];
    store.state.storage = new TodoLocalStorage();
    store.state.storage.generatedId = 1;

    localStorage.clear();
  });

  it('should render a title and a input by default', () => {
    expect(wrapper.find('.logo-title').exists()).toBeTruthy();
    expect(wrapper.find('.logo-title').text()).toEqual('todos');

    expect(wrapper.find('.main__input').exists()).toBeTruthy();
  });

  it('should render a placeholder when there is no todo', () => {
    expect(wrapper.find('.main__ul__li').exists()).toBeFalsy();
    expect(wrapper.find('.main__no-content__placeholder').exists()).toBeTruthy();
  });

  it('should render a filter div by default', () => {
    expect(wrapper.find('.main__filter').exists()).toBeTruthy();
    expect(wrapper.find('.main__filter__ul').exists()).toBeTruthy();
    expect(wrapper.findAll('.todo-main-filter-ul-li').length).toBe(3);
    expect(wrapper.findAll('.todo-main-filter-ul-li').at(0).text()).toBe('All');
    expect(wrapper.findAll('.todo-main-filter-ul-li').at(1).text()).toBe('Active');
    expect(wrapper.findAll('.todo-main-filter-ul-li').at(2).text()).toBe('Completed');
  });

  it('should render a list when todo exists', () => {
    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit({
      type: 'refreshTodos',
    });
    wrapper = shallowMount(Home, { router, store, localVue, stubs: ['router-link'] });

    expect(wrapper.find('.main__ul').exists()).toBeTruthy();
    expect(wrapper.find('.main__ul__li__label__content--uncompleted').exists()).toBeTruthy();
    expect(wrapper.find('.main__ul__li__label__content--uncompleted').text()).toBe('cooking');
  });

  it('should render filter correctly when exists one todo', () => {
    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit({
      type: 'refreshTodos',
    });
    wrapper = shallowMount(Home, { router, store, localVue, stubs: ['router-link'] });

    expect(wrapper.find('.main__filter__count').exists()).toBeTruthy();
    expect(wrapper.find('.main__filter__count').text()).toBe('1 item left');
    expect(wrapper.find('.main__filter__tail').exists()).toBeFalsy();
  });

  it('should render filter correctly when exists two or more todos', () => {
    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit({
      type: 'addNewTodo',
      content: 'running',
    });
    store.commit({
      type: 'refreshTodos',
    });
    wrapper = shallowMount(Home, { router, store, localVue, stubs: ['router-link'] });

    expect(wrapper.find('.main__filter__count').exists()).toBeTruthy();
    expect(wrapper.find('.main__filter__count').text()).toBe('2 items left');
    expect(wrapper.find('.main__filter__tail').exists()).toBeFalsy();
  });

  it('should double-bind input view and view-model', () => {
    const input = wrapper.find('.main__input');
    input.setValue('cooking');

    expect(wrapper.vm.$data.inputText).toBe('cooking');
  });

  it('should commit addNewTodo when user press ENTER in input', () => {
    const input = wrapper.find('.main__input');
    input.setValue('cooking');
    input.trigger('keypress', {
      key: 'Enter',
    });

    expect(store.state.todos).toHaveLength(1);
    expect(store.state.todos[0].id).toBe(1);
    expect(store.state.todos[0].content).toBe('cooking');
    expect(store.state.todos[0].isCompleted).toBe(false);

    expect(store.state.storage.getTodos()).toHaveLength(1);
  });

  it('should not commit addNewTodo when user press ENTER in input and content is empty', () => {
    const input = wrapper.find('.main__input');
    input.setValue('');
    input.trigger('keypress', {
      key: 'Enter',
    });

    expect(store.state.todos).toHaveLength(0);

    expect(store.state.storage.getTodos()).toHaveLength(0);
  });

  it('should change todo status', () => {
    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit({
      type: 'setTodoStatus',
      id: 1,
      isCompleted: true,
    });
    store.commit({
      type: 'refreshTodos',
    });

    expect(store.state.todos[0].isCompleted).toBe(true);

    store.commit({
      type: 'setTodoStatus',
      id: 1,
      isCompleted: false,
    });
    store.commit({
      type: 'refreshTodos',
    });

    expect(store.state.todos[0].isCompleted).toBe(false);
  });

  it('should delete todo by id', function () {
    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit({
      type: 'addNewTodo',
      content: 'running',
    });
    store.commit({
      type: 'refreshTodos',
    });

    expect(store.state.todos.length).toBe(2);
    expect(store.state.storage.getTodos().length).toBe(2);

    store.commit({
      type: 'deleteTodo',
      id: 2,
    });
    store.commit({
      type: 'refreshTodos',
    });

    expect(store.state.todos.length).toBe(1);
    expect(store.state.storage.getTodos().length).toBe(1);

    expect(store.state.todos[0].id).toBe(1);
    expect(store.state.todos[0].content).toBe('cooking');
    expect(store.state.todos[0].isCompleted).toBe(false);

    expect(store.state.storage.getTodos()[0].id).toBe(1);
    expect(store.state.storage.getTodos()[0].content).toBe('cooking');
    expect(store.state.storage.getTodos()[0].isCompleted).toBe(false);
  });

  it('should delete all completed todos', function () {
    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit({
      type: 'addNewTodo',
      content: 'running',
    });
    store.commit({
      type: 'setTodoStatus',
      id: 1,
      isCompleted: true,
    });
    store.commit({
      type: 'deleteAllCompletedTodos',
    });
    store.commit({
      type: 'refreshTodos',
    });

    expect(store.state.todos.length).toBe(1);
    expect(store.state.storage.getTodos().length).toBe(1);

    expect(store.state.todos[0].id).toBe(2);
    expect(store.state.todos[0].content).toBe('running');
    expect(store.state.todos[0].isCompleted).toBe(false);

    expect(store.state.storage.getTodos()[0].id).toBe(2);
    expect(store.state.storage.getTodos()[0].content).toBe('running');
    expect(store.state.storage.getTodos()[0].isCompleted).toBe(false);
  });

  it('should render todos correctly when filter type is all', () => {
    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit({
      type: 'addNewTodo',
      content: 'running',
    });
    store.commit({
      type: 'addNewTodo',
      content: 'swimming',
    });
    store.commit({
      type: 'setTodoStatus',
      id: 1,
      isCompleted: true,
    });
    store.commit({
      type: 'refreshTodos',
    });
    wrapper = shallowMount(Home, { router, store, localVue, stubs: ['router-link'] });

    wrapper.find('#all-filter').trigger('click');

    expect(wrapper.find('.main__filter__count').exists()).toBeTruthy();
    expect(wrapper.find('.main__filter__count').text()).toBe('3 items left');
    expect(wrapper.find('.main__filter__tail').exists()).toBeTruthy();
  });

  it('should render todos correctly when filter type is active', () => {
    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit({
      type: 'addNewTodo',
      content: 'running',
    });
    store.commit({
      type: 'addNewTodo',
      content: 'swimming',
    });
    store.commit({
      type: 'setTodoStatus',
      id: 1,
      isCompleted: true,
    });
    store.commit({
      type: 'refreshTodos',
    });
    router.push('/#/active');
    wrapper = shallowMount(Home, { router, store, localVue, stubs: ['router-link'] });

    expect(wrapper.find('.main__filter__count').exists()).toBeTruthy();
    expect(wrapper.find('.main__filter__count').text()).toBe('2 items left');
    expect(wrapper.find('.main__filter__tail').exists()).toBeTruthy();
  });

  it('should render todos correctly when filter type is completed', function () {
    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit({
      type: 'addNewTodo',
      content: 'running',
    });
    store.commit({
      type: 'addNewTodo',
      content: 'swimming',
    });
    store.commit({
      type: 'setTodoStatus',
      id: 1,
      isCompleted: true,
    });
    store.commit({
      type: 'refreshTodos',
    });
    router.push('/#/completed');
    wrapper = shallowMount(Home, { router, store, localVue, stubs: ['router-link'] });

    expect(wrapper.find('.main__filter__count').exists()).toBeTruthy();
    expect(wrapper.find('.main__filter__count').text()).toBe('1 item left');
    expect(wrapper.find('.main__filter__tail').exists()).toBeTruthy();
  });

  it('should update todo content', function () {
    store.commit({
      type: 'addNewTodo',
      content: 'cooking',
    });
    store.commit({
      type: 'updateTodoContent',
      id: 1,
      content: 'running',
      isCompleted: false,
    });
    store.commit({
      type: 'refreshTodos',
    });

    expect(store.state.todos[0].content).toBe('running');
    expect(store.state.storage.getTodos()[0].content).toBe('running');
  });
});
