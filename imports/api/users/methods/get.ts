import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import {
    AvailableUserMethods,
    MethodGetUsersAllEmailsModel,
    MethodGetUsersAllEmailsResponseModel,
    UserModel,
} from '../models';
import { isCurrentUserAdmin } from '/imports/utils/checks';
import { noAuthError } from '/imports/utils/serverErrors';
import { currentUserAsync } from '/server/utils/meteor';

Meteor.methods({
    [AvailableUserMethods.GET_ALL_EMAILS]: async ({
        userIds,
    }: MethodGetUsersAllEmailsModel): Promise<MethodGetUsersAllEmailsResponseModel> => {
        check(userIds, [String]);

        const user = await currentUserAsync();
        if (!user) return noAuthError();

        if (!(await isCurrentUserAdmin())) return noAuthError();

        const users = (await Meteor.users
            .find(
                {
                    _id: {
                        $in: userIds,
                    },
                },
                {
                    fields: {
                        _id: 1,
                        emails: 1,
                    },
                },
            )
            .fetchAsync()) as unknown as Pick<UserModel, '_id' | 'emails'>[];

        return {
            users,
        };
    },
});
