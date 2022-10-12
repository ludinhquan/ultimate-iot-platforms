import {IRepository} from "@iot-platforms/data-access";
import {ConnectionItem, ConnectionItems} from "@svc-datasource/domain";

export const ConnectionItemRepository = Symbol('IConnectionItemRepository');

export interface IConnectionItemRepository extends IRepository {
  bulkSave(items: ConnectionItems): Promise<{total: number}>,
  find(item: Partial<ConnectionItem>): Promise<ConnectionItems>
}
