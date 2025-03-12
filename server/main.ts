import { Meteor } from 'meteor/meteor';
import { createDefaultUserAccount } from './utils/dummyData';
import PostLikeCollection from '/imports/api/postLike/postLike';
import '/imports/startup/imports';

Meteor.startup(async () => {
    console.log('Creating collection indexes');
    PostLikeCollection.rawCollection().createIndex({ postId: 1, userId: 1 });
    console.log('[DONE] Creating collection indexes');

    // Deny all client-side updates to user documents (security layer)
    Meteor.users?.deny({ update: () => true });

    const defaultUser = await Meteor.users.findOneAsync({ 'emails.address': 'admin@gmail.com' });

    if (!defaultUser) {
        // for development only remove before production
        console.log('Creating default user account');
        await createDefaultUserAccount();
        console.log('[DONE] Creating default user account');

        console.log('All default data has been created');
    }

    console.log('Startup complete');
});
