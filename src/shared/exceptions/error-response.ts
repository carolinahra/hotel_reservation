interface ErrorResponseProps {
      httpCode: number;
     errorMessage: string
}

export class ErrorResponse {
    public httpCode: number;
    public errorMessage: string

    constructor(props: ErrorResponseProps) {
        this.httpCode = props.httpCode;
        this.errorMessage = props.errorMessage;
    }
}