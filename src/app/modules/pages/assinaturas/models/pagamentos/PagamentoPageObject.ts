import { PagamentoResponse } from "./PagamentoResponse";

export class PagamentoPageObject {
    content: PagamentoResponse[];
    numberOfElements: number;
    pageNumber: number;
    pageSize: number;
    size: number;
    totalElements: number;
    totalPages: number;
    sortDirection: string;

    constructor(item) {
        this.content = item?.content;
        this.numberOfElements = item?.numberOfElements;
        this.pageNumber = item?.pageNumber;
        this.pageSize = item?.pageSize;
        this.size = item?.size;
        this.totalElements = item?.totalElements;
        this.totalPages = item?.totalPages;
        this.sortDirection = item?.sortDirection;
    }

}