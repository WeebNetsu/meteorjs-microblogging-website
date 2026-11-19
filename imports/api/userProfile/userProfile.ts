import { Mongo } from 'meteor/mongo';
import UserProfileModel from './models';

const UserProfileCollection = new Mongo.Collection<UserProfileModel>('user_profiles');

export default UserProfileCollection;
