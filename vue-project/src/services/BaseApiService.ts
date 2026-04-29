import { httpClient } from './httpClient';

export abstract class BaseApiService<T> {

    constructor(private endpoint: string) {
    }

    protected url(path: string = ''): string {
        return `${this.endpoint}${path}`;
    }

    async getAll(): Promise<T[]> {
        const { data } = await httpClient.get<T[]>(this.endpoint);
        return data;
    }

    async getById(id: string): Promise<T> {
        const { data } = await httpClient.get<T>(`${this.endpoint}/${id}`);
        return data;
    }

    async create(item: T): Promise<T> {
        const { data } = await httpClient.post<T>(this.endpoint, item);
        return data;
    }

    async update(id: string, item: T): Promise<void> {
        await httpClient.put<void>(`${this.endpoint}/${id}`, item);
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete<void>(`${this.endpoint}/${id}`);
    }

}
