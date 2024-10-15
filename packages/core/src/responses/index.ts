type HttpResponse = {
  statusCode: number,
  body: string,
}

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

const successHttpResponse = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    body: JSON.stringify(successResponse(data)),
  };
}

const errorHttpResponse = (message: string, statusCode = 500): HttpResponse => {
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
  HttpResponse,
};