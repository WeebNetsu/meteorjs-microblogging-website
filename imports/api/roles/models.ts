export enum AvailableUserRoles {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
}

/**
 * This model is based off of the roles collection provided by the meteor roles package
 */
interface RoleModel {
    _id: string;
    userId: string;
    roles: AvailableUserRoles[];
}

export default RoleModel;

// ---- METHODS ----
export enum AvailableRolesMethods {
    // GET
    GET_USER_ROLES = 'get.roles.userRoles',
    GET_HAS_ADMIN_ROLE = 'get.roles.hasAdminRole',
}

// ---- GET METHOD MODELS ----
export interface UserLinkedRoleModel {
    userId: string;
    roles: AvailableUserRoles[];
}

export interface MethodGetRolesUserRolesModel {
    userIds: string[];
}

export interface ResultGetRolesUserRolesModel {
    result: UserLinkedRoleModel[];
}

export interface ResultGetRolesHasAdminRoleModel {
    admin: boolean;
}

// ---- SET METHOD MODELS ----
export interface MethodSetRolesUpdateUserRolesModel {
    role: AvailableUserRoles;
    users: string[];
    removeRole?: boolean;
}
