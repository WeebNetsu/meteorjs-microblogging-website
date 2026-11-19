import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import {
    AvailableRolesMethods,
    AvailableUserRoles,
    MethodGetRolesUserRolesModel,
    ResultGetRolesHasAdminRoleModel,
    ResultGetRolesUserRolesModel,
} from '../models';
import { currentUserAsync } from '/server/utils/meteor';

Meteor.methods({
    [AvailableRolesMethods.GET_USER_ROLES]: async ({
        userIds,
    }: MethodGetRolesUserRolesModel): Promise<ResultGetRolesUserRolesModel> => {
        check(userIds, [String]);

        const res = await Promise.all(
            userIds.map(async (userId) => {
                const roles = await Roles.getRolesForUserAsync(userId);

                return { userId, roles: roles as AvailableUserRoles[] };
            }),
        );

        return { result: res };
    },
    [AvailableRolesMethods.GET_HAS_ADMIN_ROLE]: async (): Promise<ResultGetRolesHasAdminRoleModel> => {
        const user = await currentUserAsync();
        if (!user) {
            return {
                admin: false,
            };
        }

        const roles = await Roles.getRolesForUserAsync(user._id);

        return {
            admin: roles?.includes(AvailableUserRoles.ADMIN),
        };
    },
});
