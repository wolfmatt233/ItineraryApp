/**
 * @param {Array} items - Array of items to paginate
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @returns {Object} - Object containing paginated items and pagination info
 */

const paginate = (items, page = 1, limit = 10) => {
  //First and last items
  const firstItem = (page - 1) * limit;
  const lastItem = page * limit;

  // Edited array
  const paginatedItems = items.slice(firstItem, lastItem);

  // Pagination object
  const pagination = {
    totalItems: items.length,
    totalPages: Math.ceil(items.length / limit),
    currentPage: page,
    itemsPerPage: limit,
    items: paginatedItems,
  };

  return pagination;
};

export default paginate;
