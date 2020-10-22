class TodoVM {
  id: number;

  content: string;

  isCompleted: boolean;

  constructor(id: number, content: string, isCompleted?: boolean) {
    this.id = id;
    this.content = content;
    this.isCompleted = isCompleted === undefined ? false : isCompleted;
  }
}

export default TodoVM;
