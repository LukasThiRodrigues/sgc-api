import { User } from "src/user/user.entity";

export const mockUser = (partial?: Partial<User>): User => ({
  id: partial?.id ?? 1,
  name: partial?.name ?? 'Usuário Mock',
  email: partial?.email ?? 'mock@email.com',
  password: partial?.password ?? '123456',
  createdAt: partial?.createdAt ?? new Date(),
  supplierId: partial?.supplierId ?? 1,
  ...partial,
});
