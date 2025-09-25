function parseSortBy(value) {
  const keys = ['_id', 'name', 'email', 'phone', 'job'];

  if (!value || !keys.includes(value)) {
    return '_id';
  }

  return value;
}

function parseSortOrder(value) {
  if (value !== 'asc' && value !== 'desc') {
    return 'asc';
  }
  return value;
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  return {
    sortBy: parseSortBy(sortBy),
    sortOrder: parseSortOrder(sortOrder),
  };
}
