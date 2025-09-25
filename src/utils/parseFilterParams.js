export function parseFilterParams(query) {
  const { type, isFavourite } = query;

  const filter = {};

  if (type) filter.contactType = type;

  if (isFavourite === 'true') filter.isFavourite = true;
  else if (isFavourite === 'false') filter.isFavourite = false;

  return filter;
}
