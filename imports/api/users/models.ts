/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';

export class UserModel implements Meteor.User {
    _id!: string;

    username?: string;

    emails!: Meteor.UserEmail[];

    createdAt!: Date;

    deleted?: boolean;

    /**
     * This will be the profile ID for this user
     */
    profile!: string;

    services?: {
        password: string;
    };
}

// ---- METHODS ----
export enum AvailableUserMethods {
    // GET
    GET_ALL_EMAILS = 'get.users.allEmails',

    // SET
    SET_CREATE = 'set.user.create',
}

// ---- GET METHOD MODELS ----
export interface MethodGetUsersAllEmailsModel {
    userIds: string[];
}

export type MiniGetUsersAllEmailsResponseUserModel = Pick<UserModel, '_id' | 'emails'>;

export interface MethodGetUsersAllEmailsResponseModel {
    users: MiniGetUsersAllEmailsResponseUserModel[];
}

// ---- SET METHOD MODELS ----
export interface MethodSetUserCreateModel {
    email: string;
    password: string;
    firstName: string;
    lastName: string | undefined;
    username: string;
}
