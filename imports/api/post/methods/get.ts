import { Meteor } from 'meteor/meteor';
import UserProfileModel from '../../userProfile/models';
import UserProfileCollection from '../../userProfile/userProfile';
import PostModel, { AvailablePostMethods, ResultGetPostsLatestModel } from '../models';
import PostCollection from '../post';

Meteor.methods({
    [AvailablePostMethods.GET_LATEST_WITH_USER_PROFILES]: async (): Promise<ResultGetPostsLatestModel> => {
        const posts: Pick<PostModel, '_id' | 'createdAt' | 'text' | 'userId'>[] = await PostCollection.find(
            {},
            {
                limit: 10,
                fields: {
                    _id: 1,
                    createdAt: 1,
                    text: 1,
                    userId: 1,
                },
                skip: 0,
                sort: { createdAt: -1 },
            },
        ).fetchAsync();

        const users: Pick<UserProfileModel, '_id' | 'username' | 'userId' | 'photo'>[] =
            await UserProfileCollection.find(
                {
                    userId: {
                        $in: posts.map((p) => p.userId),
                    },
                },
                {
                    fields: {
                        _id: 1,
                        username: 1,
                        userId: 1,
                        photo: 1,
                    },
                },
            ).fetchAsync();

        return { posts, users };
    },
});
