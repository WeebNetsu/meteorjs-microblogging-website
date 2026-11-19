import { Mongo } from 'meteor/mongo';
import PostLikeModel from './models';

const PostLikeCollection = new Mongo.Collection<PostLikeModel>('post_likes');

export default PostLikeCollection;
