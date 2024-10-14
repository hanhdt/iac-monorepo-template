const successResponse = (data: any) => {
  return {
    status: 'success',
    data,
  };
}

const errorResponse = (message: string) => {
  return {
    status: 'error',
    message,
  };
}

const successHttpResponse = (data: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify(successResponse(data)),
  };
}

const errorHttpResponse = (message: string, statusCode = 500) => {
  return {
    statusCode,
    body: JSON.stringify(errorResponse(message)),
  };
}

export {
  successResponse,
  errorResponse,
  successHttpResponse,
  errorHttpResponse,
};