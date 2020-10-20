export const mockAddNewTodo = jest.fn();
const mockManager = jest.fn().mockImplementation(() => ({
  addNewTodo: mockAddNewTodo,
}));

export default mockManager;
