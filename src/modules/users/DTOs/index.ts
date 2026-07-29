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

export type LoginUserDTO = {
    email: string;
    password: string;
};

type TokenResponseDTO = {
    accessToken: string;
};

export type LoginUserResponseDTO = {
    userId: string;
    token: TokenResponseDTO;
    refreshToken: string;
};

export type RefreshUserDTO = {
    refreshToken: string;
};
