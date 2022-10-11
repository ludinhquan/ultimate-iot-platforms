interface ClassType<T> extends Function {
  new(...args: any[]): T;
}

interface IOrganization {
  id: string,
  name: string,
}

interface IUser {
  id: string,
  firstName: string,
  lastName: string,
  isAdmin: boolean,
  isActive: boolean,
  isOwner: boolean,
  iat: number,
  organization: IOrganization
}
