import { checkStrEmpty, limitText } from '@netsu/js-utils';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { createNewSystemLogSafe } from '../../systemChangeLogs/utils';
import { MethodSetPostCreateModel } from '../models';
import PostCollection from '../post';
import { MAX_POST_LENGTH } from '/imports/utils/constants';
import { getUserEmail } from '/imports/utils/meteor';
import { clientContentError, noAuthError } from '/imports/utils/serverErrors';
import { currentUserAsync } from '/server/utils/meteor';

Meteor.methods({
    'set.post.create': async ({ text }: MethodSetPostCreateModel) => {
        check(text, String);

        if (checkStrEmpty(text)) return clientContentError('Post text is required');
        const cleanedText = text.trim();
        if (cleanedText.length > MAX_POST_LENGTH) return clientContentError('Post text is too long');

        const user = await currentUserAsync();
        if (!user) return noAuthError();

        await PostCollection.insertAsync({
            createdAt: new Date(),
            text: cleanedText,
            userId: user._id,
        });

        await createNewSystemLogSafe({
            subject: `${getUserEmail(user) ?? user._id} has created a post: ${limitText(text)}`,
            update: `await PostCollection.insertAsync(${JSON.stringify({
                createdAt: new Date(),
                text: cleanedText,
                userId: user._id,
            })});`,
            method: 'set.post.create',
        });
    },
});
