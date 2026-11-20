const SORT_DIRECTIONS = new Set(["asc", "desc"]);

function pagination(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 50));
  return { skip: (page - 1) * limit, take: limit, page, limit };
}

function sortOrder(query, allowedFields, defaultField = "name") {
  const field = allowedFields.includes(query.sortBy) ? query.sortBy : defaultField;
  const direction = SORT_DIRECTIONS.has(String(query.order || "").toLowerCase())
    ? String(query.order).toLowerCase()
    : "asc";
  return { [field]: direction };
}

function containsFilter(value) {
  if (!value || !String(value).trim()) return undefined;
  return { contains: String(value).trim() };
}

function roundAvg(value) {
  if (value === null || value === undefined) return 0;
  return Number(Number(value).toFixed(2));
}

module.exports = { pagination, sortOrder, containsFilter, roundAvg };
