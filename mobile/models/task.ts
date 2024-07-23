export default interface Task {
  id: string;
  name: string;
  createdAt: Date;
  completed: boolean;
  completedAt?: Date;
}
