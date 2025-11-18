import { Item } from "src/item/item.entity";
import { mockUser } from "./mock-user.factory";

export const mockItem = (partial?: Partial<Item>): Item => ({
  id: partial?.id ?? 1,
  code: partial?.code ?? 'DEFAULT-CODE',
  createdAt: partial?.createdAt ?? new Date(),
  item: partial?.item ?? 'Item Name',
  description: partial?.description ?? 'Description',
  unit: partial?.unit ?? 'UN',
  creatorId: partial?.creatorId ?? 1,
  creator: partial?.creator ?? mockUser(),
  ...partial,
});
