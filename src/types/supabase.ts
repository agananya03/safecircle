export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    created_at: string
                    // Add other columns as needed
                }
                Insert: {
                    id?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    created_at?: string
                }
            }
        }
    }
}
