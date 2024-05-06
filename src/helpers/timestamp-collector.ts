import { TodoWithChildren } from "@/types";

export function timestampCollector(
  todo: TodoWithChildren,
  totalTimestamp: number = 0,
  currentTimestamp: number,
  inProgressTodoId: number | null = null,
): { totalTimestamp: number; inProgressTodoId: number | null } {
  if (todo?.children && todo.children.length > 0) {
    for (const child of todo.children) {
      const {
        totalTimestamp: childTotalTimestamp,
        inProgressTodoId: childInProgressTodoId,
      } = timestampCollector(
        child as TodoWithChildren,
        totalTimestamp,
        currentTimestamp,
        inProgressTodoId,
      );
      totalTimestamp = childTotalTimestamp;
      inProgressTodoId = childInProgressTodoId;
    }
    return { totalTimestamp, inProgressTodoId };
  }
  if (todo.status === "in-progress") {
    const elapsed = currentTimestamp - todo.updatedAt.getTime();
    return {
      totalTimestamp:
        totalTimestamp + todo.timeSpent + (elapsed > 0 ? elapsed : 0),
      inProgressTodoId: todo.id,
    };
  }
  return {
    totalTimestamp: totalTimestamp + todo.timeSpent,
    inProgressTodoId: inProgressTodoId,
  };
}
