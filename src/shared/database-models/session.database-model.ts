export interface SessionTuple {
    id: number;
    guest_id: number;
    token: string;
    session_extension_minutes: number;
    created_at: string;
    updated_at: string;
}

export interface SessionTable {
    Session: SessionTuple;
}