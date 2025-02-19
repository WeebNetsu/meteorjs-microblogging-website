import { checkStrEmpty, emailRegex } from "@netsu/js-utils";
import { Accounts } from "meteor/accounts-base";
import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { MethodSetUserCreateModel, UserProfileModel } from "../models";
import { clientContentError, notFoundError } from "/imports/utils/serverErrors";

Meteor.methods({
	"set.user.create": async function ({
		email,
		password,
		firstName,
		lastName,
	}: MethodSetUserCreateModel) {
		check(email, String);
		check(password, String);
		check(firstName, String);
		check(lastName, String);

		const cleanedEmail = email.trim();

		if (!emailRegex.test(cleanedEmail)) {
			return clientContentError("Email is invalid");
		}

		if (password.length < 8) {
			return clientContentError("Password is too short");
		}

		if (checkStrEmpty([firstName, lastName])) {
			return clientContentError("First and last names are required");
		}

		await Accounts.createUserAsync({
			email,
			password,
		});

		const newUser = await Meteor.users.findOneAsync({
			"emails.address": email,
		});

		if (!newUser) return notFoundError("new user");

		const profile: UserProfileModel = {
			firstName,
			lastName,
		};

		await Meteor.users.updateAsync(newUser._id, {
			$set: {
				profile,
			},
		});
	},
});
