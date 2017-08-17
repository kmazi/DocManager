const pagination = (payload, params) => ({
  page: parseInt(params.offset / params.limit, 10) + 1,
  pageCount: Math.ceil(payload.count / params.limit),
  pageSize: payload.rows.length < 8 ? payload.rows.length : 8,
});
export default pagination;
