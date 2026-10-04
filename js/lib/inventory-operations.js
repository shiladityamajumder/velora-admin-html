import { createId } from "./id.js";
import { availableStock } from "./workflows.js";
export function applyStockTransfer(rows, input) {
  if (input.sourceWarehouse === input.destinationWarehouse)
    throw new Error("Choose a different destination warehouse");
  if (!Number.isInteger(input.quantity) || input.quantity <= 0)
    throw new Error("Enter a valid number");
  const source = rows.find(
    (row) => row.sku === input.sku && row.batch === input.batch && row.warehouse === input.sourceWarehouse
  );
  if (!source) throw new Error("Inventory batch not found");
  if (availableStock(Number(source.quantity), Number(source.reserved)) < input.quantity)
    throw new Error("Insufficient available stock");
  const target = rows.find(
    (row) => row.sku === input.sku && row.batch === input.batch && row.warehouse === input.destinationWarehouse
  );
  const result = rows.map(
    (row) => row.id === source.id ? { ...row, quantity: Number(row.quantity) - input.quantity } : row.id === target?.id ? { ...row, quantity: Number(row.quantity) + input.quantity } : row
  );
  if (!target)
    result.push({
      ...source,
      id: createId(),
      warehouse: input.destinationWarehouse,
      quantity: input.quantity,
      reserved: 0,
      createdAt: (new Date()).toISOString()
    });
  return result.map(withStockStatus);
}
export function applyStockAdjustment(rows, input) {
  const row = rows.find(
    (row2) => row2.sku === input.sku && row2.batch === input.batch && row2.warehouse === input.warehouse
  );
  if (!row) throw new Error("Inventory batch not found");
  if (!Number.isInteger(input.quantity) || input.quantity < Number(row.reserved))
    throw new Error("Reserved quantity exceeds stock");
  return rows.map(
    (item) => item.id === row.id ? withStockStatus({ ...item, quantity: input.quantity }) : item
  );
}
function withStockStatus(row) {
  return ["Damaged", "Non-saleable"].includes(row.status) ? row : {
    ...row,
    status: Number(row.quantity) === 0 ? "Out of stock" : Number(row.quantity) < 50 ? "Low stock" : "Active"
  };
}
