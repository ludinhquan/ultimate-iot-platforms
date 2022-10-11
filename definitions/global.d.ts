export {}

declare global {
  export type isDevelopment = boolean

  namespace Express {
    interface User extends IUser {}
  }
}
