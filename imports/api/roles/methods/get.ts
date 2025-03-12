import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { MethodGetRolesUserRolesModel, ResultGetRolesUserRolesModel } from '../models';

Meteor.methods({
    'get.roles.userRoles': async ({ userIds }: MethodGetRolesUserRolesModel): Promise<ResultGetRolesUserRolesModel> => {
        check(userIds, [String]);

        const res = await Promise.all(
            userIds.map(async (userId) => {
                const roles = await Roles.getRolesForUserAsync(userId);

                // a user chan only belong to a single church thus we only get the first id from the array
                return { userId, roles };
            }),
        );

        return { result: res };
    },
});
