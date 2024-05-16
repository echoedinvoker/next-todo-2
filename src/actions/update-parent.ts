import { db } from "@/db";
import { Todo } from "@prisma/client";

interface UpdateParentProps {
  parentId: number;
  elapsed?: number;
  parentList?: number[];
}

export async function updateParent({ parentId, elapsed, parentList = [] }: UpdateParentProps) {
  const parent = await db.todo.findUnique({
    where: { id: parentId },
    include: { children: true },
  });

  if (!parent) {
    return parentList;
  }

  parentList.unshift(parent.id)

  const duration = parent.children.reduce<any>(
    (acc, child) => {
      const childDuration = child.duration
      if (childDuration) {
        return (acc ?? 0) + childDuration;
      }
      return acc;
    }, null);

  const data: any = { duration };
  if (elapsed) {
    data.timeSpent = parent.timeSpent + elapsed;
  }

  const newParent = await db.todo.update({
    where: { id: parentId },
    data,
    include: { children: true },
  });

  const status = getStatus(newParent);

  await db.todo.update({
    where: { id: parentId },
    data: {
      status,
      done: status === "completed",
    },
  });

  if (parent.parentId) {
    const props: any = { parentId: parent.parentId, parentList };
    if (elapsed) {
      props.elapsed = elapsed;
    }
    await updateParent(props);
  }

  return parentList;
}

interface TodoWithChildren extends Todo {
  children: Todo[];
}

function getStatus(todo: TodoWithChildren) {
  if (todo.children.length === 0) {
    if (todo.timeSpent) return "pause"
    return "not-started";
  }

  if (todo.children.every((child) => child.status === "archived")) return "archived";
  if (todo.children.every((child) => ["completed", "archived"].includes(child.status))) return "completed";
  if (todo.children.some((child) => child.status === "in-progress")) return "in-progress";
  if (todo.timeSpent) return "pause";
  return "not-started";
}
