export interface Contact {
    Name: {
        DisplayName: string;
    };
    Portrait: {
        Data: string;
    };
    GroupSelect: Array<any>;
    Organization: Array<{
        Company: string;
        Job: string;
    }>;
    Phone: Array<{
        Type: number;
        Name: string;
    }>;
    Address: Array<{
        Type: number;
        Street: string;
    }>;
    Email: Array<{
        Type: number;
        Name: string;
    }>;
    IM: Array<{
        Type: number;
        Name: string;
    }>;
    Website: Array<{
        Type: number;
        Url: string;
    }>;
    Event: Array<{
        Type: number;
        StartDate: string;
    }>;
    Note: Array<{
        Content: string;
    }>
}
