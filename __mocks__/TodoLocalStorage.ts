export let mockGetGeneratedId = jest.fn();
export let mockSetGeneratedId = jest.fn();
export let mockGetTodos = jest.fn();
export let mockSetTodos = jest.fn();
export let mockCreate = jest.fn();
export let mockDelete = jest.fn();
export let mockFind = jest.fn();
export let mockUpdate = jest.fn();

const mockLocalStorage = jest.fn().mockImplementation(() => ({
  getGeneratedId: mockGetGeneratedId,
  setTodoStatus: mockSetGeneratedId,
  getTodos: mockGetTodos,
  setTodos: mockSetTodos,
  create: mockCreate,
  delete: mockDelete,
  find: mockFind,
  update: mockUpdate,
}));

export default mockLocalStorage;
