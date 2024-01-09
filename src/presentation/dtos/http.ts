export interface HttpRequestDTO{
    params?: any,
    body?: any,
    headers?: any,
    query?: any,
    file?: {
        path: string
    }
}

export interface HttpResponseDTO{
    statusCode: number,
    body: any
}