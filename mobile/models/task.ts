export default interface Task {
  id: number;
  title: string;
  createdAt: Date;
  completed: boolean;
  completedAt?: Date;
}
