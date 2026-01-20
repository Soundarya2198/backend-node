export default (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});
