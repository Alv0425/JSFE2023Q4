class TasksQueue<T> {
  private queue: T[] = [];

  public enqueue(task: T): void {
    this.queue.push(task);
  }

  public dequeue(): T | undefined {
    return this.queue.shift();
  }

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

const tasksQueue = new TasksQueue();

export default tasksQueue;
