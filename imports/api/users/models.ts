/* eslint-disable import/prefer-default-export */
import { Meteor } from "meteor/meteor";

export interface UserProfileModel {
	/**
	 * The first name of the user
	 */
	firstName: string;
	/**
	 * The last name of the user
	 */
	lastName?: string;
}

export class UserModel implements Meteor.User {
	_id!: string;

	username?: string;

	emails!: Meteor.UserEmail[];

	createdAt!: Date;

	deleted?: boolean;

	profile!: UserProfileModel;

	services?: {
		password: string;
	};
}

// ---- GET METHOD MODELS ----

// ---- SET METHOD MODELS ----
export interface MethodSetUserCreateModel {
	email: string;
	password: string;
	firstName: string;
	lastName: string | undefined;
}
