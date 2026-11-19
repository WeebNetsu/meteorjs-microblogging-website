import { Meteor } from 'meteor/meteor';
import { AvailableRolesMethods, AvailableUserRoles, ResultGetRolesHasAdminRoleModel } from '../api/roles/models';

/**
 * Check if current user is admin
 *
 * @returns true if current user is admin
 */
export const isCurrentUserAdmin = async () => {
    try {
        const res: ResultGetRolesHasAdminRoleModel = await Meteor.callAsync(AvailableRolesMethods.GET_HAS_ADMIN_ROLE);

        return res.admin;
    } catch (error) {
        console.error(error);
        return false;
    }
};

/**
 * This will check that a string contains only letters and numbers
 *
 * @param str string to check
 * @param allowUnderscore if the string should allow underscore
 * @returns true if string does not contain any special characters
 */
export const stringContainsOnlyLettersAndNumbers = (str: string, allowUnderscore?: boolean) => {
    if (allowUnderscore) return /^[A-Za-z0-9_]*$/.test(str);

    return /^[A-Za-z0-9]*$/.test(str);
};

/**
 * Simple way to check if roles passed in has moderator access
 *
 * @param roles roles to check through
 * @returns true if user is moderator or higher status
 */
export const isModerator = (roles: AvailableUserRoles[]) => {
    return roles.includes(AvailableUserRoles.ADMIN) || roles.includes(AvailableUserRoles.MODERATOR);
};
