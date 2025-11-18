import { ProposalItem } from "src/proposal-item/proposal-item.entity";
import { mockItem } from "./mock-item.factory";

export const mockProposalItem = (partial?: Partial<ProposalItem>) => ({
    id: partial?.id ?? 1,
    itemId: partial?.itemId ?? 99,
    item: partial?.item ?? mockItem(),
    quantity: partial?.quantity ?? 1,
    price: partial?.price ?? 1,
    total: partial?.total ?? 1,
    proposalId: partial?.proposalId ?? 10,
    ...partial,
});