import { Mongo } from 'meteor/mongo';
import PostModel from './models';

const PostCollection = new Mongo.Collection<PostModel>('posts');

export default PostCollection;
