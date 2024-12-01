export const responseHandler = (
  statusCode,
  success = false,
  message,
  count = 0,
  data = {}
) => {
  const response = {
    statusCode,
    success,
    message,
    count,
    data,
  };

  if (!success) {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    error.response = response;
    return error;
  }

  return response;
};
