import { createId } from "../lib/id.js";
import {
  modules,
  moduleSchema
} from "../config/modules.js";
import {
  applyStockTransfer,
  applyStockAdjustment
} from "../lib/inventory-operations.js";
import { readDemo, writeDemo, recordActivity } from "./repository.js";
import { MockRepository } from "./repository.js";
import { workflowTransitions } from "../lib/workflows.js";
import { seedModule } from "./seed.js";
class WorkflowRepository extends MockRepository {
  constructor(definition) {
    super(
      definition.path,
      seedModule(definition),
      (value) => moduleSchema(definition).parse(value)
    );
    this.definition = definition;
  }
  definition;
  async create(input) {
    if (this.definition.kind === "movements")
      throw new Error("Read-only history");
    if (this.definition.workflow && input.status !== this.definition.statuses[0])
      throw new Error("Invalid workflow transition");
    return super.create(input);
  }
  async delete(id) {
    if (this.definition.kind === "movements")
      throw new Error("Read-only history");
    return super.delete(id);
  }
  async update(id, changes) {
    if (this.definition.kind === "movements")
      throw new Error("Read-only history");
    if (this.definition.workflow && changes.status) {
      const previous = await this.getById(id);
      if (changes.status !== previous.status && !workflowTransitions(
        this.definition.kind,
        previous.status,
        this.definition.statuses
      ).includes(String(changes.status)))
        throw new Error("Invalid workflow transition");
    }
    if (["transfers", "adjustments"].includes(this.definition.kind) && changes.status === "Completed") {
      const previous = await this.getById(id);
      if (previous.status === "Completed") return super.update(id, changes);
      const merged = moduleSchema(this.definition).parse({
        ...previous,
        ...changes
      });
      const stockDefinition = modules.find(
        (item) => item.path === "inventory/stock"
      );
      const rows = readDemo(stockDefinition.path, seedModule(stockDefinition));
      const input = {
        sku: String(merged.sku),
        batch: String(merged.batch),
        quantity: Number(merged.quantity)
      };
      const updated = this.definition.kind === "transfers" ? applyStockTransfer(rows, {
        ...input,
        sourceWarehouse: String(merged.sourceWarehouse),
        destinationWarehouse: String(merged.destinationWarehouse)
      }) : applyStockAdjustment(rows, {
        ...input,
        warehouse: String(merged.warehouse)
      });
      for (const row of updated) moduleSchema(stockDefinition).parse(row);
      const movementDefinition = modules.find(
        (item) => item.path === "inventory/movements"
      );
      const movements = updated.filter(
        (row) => Number(row.quantity) !== Number(
          rows.find((previous2) => previous2.id === row.id)?.quantity ?? 0
        )
      ).map((row) => {
        const previousQuantity = Number(
          rows.find((previous2) => previous2.id === row.id)?.quantity ?? 0
        );
        return {
          id: createId(),
          name: this.definition.title + " \xB7 " + row.sku,
          status: "Completed",
          createdAt: (new Date()).toISOString(),
          sku: row.sku,
          batch: row.batch,
          warehouse: row.warehouse,
          previousQuantity,
          quantity: Number(row.quantity),
          change: Number(row.quantity) - previousQuantity,
          reference: merged.id,
          notes: String(merged.notes)
        };
      });
      for (const movement of movements)
        moduleSchema(movementDefinition).parse(movement);
      writeDemo(movementDefinition.path, [
        ...movements,
        ...readDemo(movementDefinition.path, seedModule(movementDefinition))
      ]);
      writeDemo(stockDefinition.path, updated);
      recordActivity(
        stockDefinition.path,
        merged.id,
        "Updated",
        this.definition.title + ": " + merged.name
      );
    }
    return super.update(id, changes);
  }
}
const services = new Map();
export function serviceFor(module) {
  let service = services.get(module.path);
  if (!service) {
    service = new WorkflowRepository(module);
    services.set(module.path, service);
  }
  return service;
}
export const orderService = serviceFor(
  modules.find((module) => module.path === "commerce/orders")
);
