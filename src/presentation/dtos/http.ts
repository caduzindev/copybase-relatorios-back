export interface HttpRequestDTO{
    params?: any,
    body?: any,
    headers?: any
}

export interface HttpResponseDTO{
    statusCode: number,
    body: any
}