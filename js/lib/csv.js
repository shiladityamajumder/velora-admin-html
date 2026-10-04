export function serializeCsv(headers, rows) {
  const escape = (value) => {
    const safe = typeof value === "string" && (/^\s*[=+@-]/.test(value) || /^[\t\r]/.test(value)) ? "'" + value : String(value);
    return '"' + safe.replaceAll('"', '""') + '"';
  };
  return "\uFEFF" + [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
}
export function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("The CSV contains an unclosed quote.");
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows[0]?.[0]) rows[0][0] = rows[0][0].replace(/^\uFEFF/, "");
  return rows;
}
