import UserProfileModel from '../userProfile/models';

interface PostModel {
    _id: string;
    /**
     * User who created this post
     */
    userId: string;
    text: string;
    createdAt: Date;
    deletedAt?: Date;
    deleted?: boolean;
}

export default PostModel;

// ---- METHODS ----
export enum AvailablePostMethods {
    // GET
    GET_LATEST_WITH_USER_PROFILES = 'get.posts.latestWithUserProfiles',

    // SET
    SET_CREATE = 'set.post.create',
    SET_DELETE = 'set.post.delete',
}

// ---- GET METHOD MODELS ----

export type MiniGetPostsLatestPostModel = Pick<PostModel, '_id' | 'createdAt' | 'text' | 'userId'>;
export type MiniGetPostsLatestUserProfileModel = Pick<UserProfileModel, '_id' | 'username' | 'userId' | 'photo'>;

export interface ResultGetPostsLatestModel {
    posts: MiniGetPostsLatestPostModel[];
    users: MiniGetPostsLatestUserProfileModel[];
}

// ---- SET METHOD MODELS ----
export interface MethodSetPostCreateModel {
    text: string;
}

export interface MethodSetPostDeleteModel {
    postId: string;
}
