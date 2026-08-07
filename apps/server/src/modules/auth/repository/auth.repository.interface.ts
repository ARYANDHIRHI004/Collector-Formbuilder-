export interface IAuthRepository {
    create: (email: string, password: string) => Promise<void>
    verify: (email: string, password: string) => Promise<void>
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}