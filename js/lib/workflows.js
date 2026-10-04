const transitions = {
  New: ["Processing", "Cancelled"],
  Processing: ["Packed", "Cancelled"],
  Packed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered", "Returned"],
  Delivered: ["Returned", "Refunded"],
  Cancelled: [],
  Returned: ["Refunded"],
  Refunded: []
};
export function orderTransitions(status) {
  return transitions[status];
}
export function expirySeverity(expiry, reference = new Date()) {
  const days = Math.ceil(
    (new Date(expiry).getTime() - reference.getTime()) / 864e5
  );
  return days < 0 ? "danger" : days <= 30 ? "warning" : "success";
}
export function availableStock(quantity, reserved) {
  return Math.max(0, quantity - reserved);
}
export function workflowTransitions(kind, status, stages) {
  if (kind === "orders") return orderTransitions(status);
  if (kind === "prescriptions")
    return ["Pending", "Needs clarification"].includes(status) ? ["Approved", "Rejected", "Needs clarification"].filter(
      (value) => value !== status
    ) : [];
  if (kind === "tickets") return stages.filter((value) => value !== status);
  if (["bookings", "appointments", "transfers", "adjustments"].includes(kind)) {
    if (["Completed", "Cancelled"].includes(status)) return [];
    const next = stages[stages.indexOf(status) + 1];
    return next && next !== "Cancelled" ? [next, "Cancelled"] : ["Cancelled"];
  }
  if (kind === "shipments") {
    if (status === "Returned") return [];
    if (["Delivered", "Failed"].includes(status)) return ["Returned"];
    const next = stages[stages.indexOf(status) + 1];
    return next ? [
      next,
      ...["In transit", "Out for delivery"].includes(status) ? ["Failed"] : []
    ] : [];
  }
  return stages.slice(stages.indexOf(status) + 1, stages.indexOf(status) + 2);
}
