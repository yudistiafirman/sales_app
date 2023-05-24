interface Header {
    [headerName: string]: string;
}

export interface Options {
    body?: string | object;
    headers?: Header;
    method?: "DELETE" | "GET" | "POST" | "PUT";
    timeoutInterval?: number;
}

export interface Response {
    bodyString?: string;
    data?: string;
    headers: Header;
    status: number;
    url: string;
    json: () => Promise<{ [key: string]: any }>;
    text: () => Promise<string>;
}
