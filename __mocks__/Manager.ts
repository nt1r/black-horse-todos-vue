export let mockAddNewTodo = jest.fn();
export let mockSetTodoStatus = jest.fn();
export let mockFindTodoById = jest.fn();

const mockManager = jest.fn().mockImplementation(() => ({
  addNewTodo: mockAddNewTodo,
  setTodoStatus: mockSetTodoStatus,
  findTodoById: mockFindTodoById,
}));

export default mockManager;
