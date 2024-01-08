export interface HttpRequestDTO{
    params?: any,
    body?: any,
    headers?: any
    file?: {
        path: string
    }
}

export interface HttpResponseDTO{
    statusCode: number,
    body: any
}