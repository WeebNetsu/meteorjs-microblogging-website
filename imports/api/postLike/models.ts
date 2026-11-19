interface PostLikeModel {
    _id: string;
    /**
     * User who liked the post
     */
    userId: string;
    postId: string;
    createdAt: Date;
}

export default PostLikeModel;

// ---- METHODS
export enum AvailablePostLikeMethods {
    SET_LIKE_OR_UNLIKE = 'set.postLike.likeOrUnlike',
}

// ---- GET METHOD MODELS ----

// ---- SET METHOD MODELS ----
export interface MethodSetPostLikeLikeOrUnlikeModel {
    postId: string;
}

// ---- PUBLICATION METHOD MODELS ----
export interface MethodPublishPostLikeTotalLikesModel {
    postId: string;
}

export interface MethodPublishPostLikeUserLikedModel {
    postId: string;
    userId: string;
}
