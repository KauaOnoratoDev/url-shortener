export type CreateUserDTO = {
    name: string;
    email: string;
    password: string;
};

export type CreateUserRepositoryDTO = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
};

export type UserResponseDTO = {
    id: string;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
};
