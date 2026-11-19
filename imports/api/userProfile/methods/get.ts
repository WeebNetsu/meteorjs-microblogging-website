import { Meteor } from 'meteor/meteor';
import UserProfileModel, {
    AvailableUserProfileMethods,
    MethodGetUserProfilesPublicDataModel,
    ResultGetUserProfilesPublicDataResponseModel,
} from '../models';
import UserProfileCollection from '../userProfile';
import { noAuthError, notFoundError } from '/imports/utils/serverErrors';

Meteor.methods({
    [AvailableUserProfileMethods.GET_PUBLIC_DATA]: async ({
        username,
    }: MethodGetUserProfilesPublicDataModel): Promise<ResultGetUserProfilesPublicDataResponseModel | undefined> => {
        const userId = Meteor.userId();
        if (!userId) return noAuthError('User not logged in');

        const userProfile:
            | Pick<UserProfileModel, '_id' | 'username' | 'photo' | 'firstName' | 'lastName' | 'userId'>
            | undefined = await UserProfileCollection.findOneAsync(username ? { username } : { userId }, {
            projection: {
                _id: 1,
                username: 1,
                photo: 1,
                firstName: 1,
                lastName: 1,
                userId: 1,
            },
        });

        if (!userProfile) return notFoundError('User');

        return {
            user: userProfile,
        };
    },
});
