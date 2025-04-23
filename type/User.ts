export type ServerUser = {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    apiKey?: string;
};

export type ClientUser = Omit<ServerUser, "passwordHash">

export type PublicUser = Omit<ClientUser, "email">


export type ApiKey = {
    apiKey: string;
    userId: string;
}

export type UserControllerResponse = {
    status: number;
    payload: ClientUser | ApiKey | string | { user: ClientUser; session: any };
}

export type LoginInformation = {
    username: string;
    password: string;
}

export type Session = {
    id: string;
    userId: string;
    expiration: Date;
}