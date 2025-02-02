export type ServerUser = {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    apiKey?: string;
};

export type ClientUser = Omit<ServerUser, "passwordHash">

export type ApiKey = {
    apiKey: string;
    userId: string;
}

export type UserControllerResponse = {
    status: number;
    payload: ClientUser | ApiKey | string;
}

export type LoginInformation = {
    username: string;
    password: string;
}