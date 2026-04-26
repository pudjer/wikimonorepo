export enum RoleName{
    Base = 'base',
    Admin = 'admin'
}
export interface Role{
    name: RoleName
}
export type RoleClass = new () => Role

export class BaseRole implements Role{
    name = RoleName.Base
}
export class AdminRole extends BaseRole{
    name = RoleName.Admin
}
export function roleByName(name: RoleName){
    switch(name){
        case RoleName.Base:
            return new BaseRole()
        case RoleName.Admin:
            return new AdminRole()
    }
}