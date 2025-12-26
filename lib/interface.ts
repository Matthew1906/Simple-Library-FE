// UI Helpers

export type FilterType =  'date' | 'string' | 'number' | 'numrange' | 'daterange' | 'checkbox' | 'select' | 'search';

export interface TableFilter {
    type:FilterType,
    key: string,
    label: string,
    value?: string | number | number[] | boolean | string[],
    options?: string[] | { key:string, value:string}[]
}

export interface Response {
    status: boolean,
    code:number,
    message:string
}

export interface OverviewResponse extends Response {
    count: number;
}

export interface SelectMetadata {
    key: string,
    value: string,
}

export interface AfterAction {
    title: string,
    description: string,
    redirect: string
}

export interface SearchParams {
    page?: number,
    numPages?: number,
    sort?: string,
    filter?: string[] | string
}

// Models

// Authors
export interface AuthorMutation {
    id?:string,
    name:string, 
}

export interface Author extends AuthorMutation {
    id:string
}

export interface AuthorOverviewResponse extends OverviewResponse {
    data: Author[] | null;
}

// Books
export type BookType = 'FICTION' | "NON_FICTION" 

export interface BookMutation {
    id?:string,
    title: string,
    description?: string | null,
    type: BookType,
    author_id: string,
    publishing_year: string,
    // image
}

export interface Book extends BookMutation {
    id:string,
    description: string | null;
    author:Author
    updated_at: Date
}

export interface BookOverviewResponse extends OverviewResponse {
    data: Book[] | null;
}

// Library members
export interface MemberMutation {
    id?:string,
    code: string,
    name:string,
    email?: string | null,
    phone_no?: string | null,
}

export interface Member extends MemberMutation {
    id:string,
    borrowings: BookBorrowing[]
}

export interface MemberOverviewResponse extends OverviewResponse {
    data: Member[] | null;
}

// Book Borrowing

export interface BookBorrowingMutation {
    books:string[],
    member_id:string,
    borrow_date: Date,
    due_date: Date
}

export interface BookBorrowing {
    id:string
    book_id: string
    book:{ title:string };
    member_id: string
    member:{ name:string };
    borrow_date: Date
    due_date: Date
    return_date: Date | null
}

export interface BookBorrowingOverviewResponse extends OverviewResponse {
    data: BookBorrowing[] | null;
}

export interface BookReturnMutation {
    return_date: Date
    borrowings: string[]
}