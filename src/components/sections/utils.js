export const iconNames = ['wrench', 'cpu', 'code', 'users', 'shield', 'rocket'];

export const asArray = value => Array.isArray(value) ? value : [];

export const formatEventDate = value => {
  const parsedDate = new Date(`${value}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
