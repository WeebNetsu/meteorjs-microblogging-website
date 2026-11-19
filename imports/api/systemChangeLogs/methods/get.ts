import { isNonEmptyStr, isOfEnum } from '@netsu/js-utils';
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import SystemChangeLogsModel, {
    AvailableSystemChangeLogMethods,
    AvailableSystemLogsSearchOptions,
    MethodGetSystemChangeLogsSearchModel,
    ResultGetSystemChangeLogsSearchModel,
} from '../models';
import SystemChangeLogsCollection from '../systemChangeLogs';
import { MongoDBSelector } from '/imports/types/interfaces';
import { clientContentError } from '/imports/utils/serverErrors';

Meteor.methods({
    [AvailableSystemChangeLogMethods.GET_SEARCH]: async ({
        search,
        filter,
        strict,
        limit,
        skip,
    }: MethodGetSystemChangeLogsSearchModel): Promise<ResultGetSystemChangeLogsSearchModel> => {
        check(search, String);
        check(filter, String);
        check(strict, Match.Optional(Boolean));
        check(limit, Number);
        check(skip, Number);

        if (!isOfEnum(filter, AvailableSystemLogsSearchOptions)) {
            return clientContentError('Filter is invalid');
        }

        const cleanedLimit = Math.round(Math.abs(limit));

        if (cleanedLimit < 1 || cleanedLimit > 100) {
            return clientContentError('Limit must be between 1 and 100');
        }

        if (skip < 0) {
            return clientContentError('Skip is invalid');
        }

        const regex = new RegExp(search, 'ig');

        const orValue = [];

        switch (filter) {
            case AvailableSystemLogsSearchOptions.SUBJECT:
                orValue.push({
                    subject: strict ? search : { $regex: regex },
                });
                break;
            case AvailableSystemLogsSearchOptions.NOTE:
                orValue.push({
                    note: strict ? search : { $regex: regex },
                });
                break;
            case AvailableSystemLogsSearchOptions.UPDATE:
                orValue.push({
                    update: strict ? search : { $regex: regex },
                });
                break;
            case AvailableSystemLogsSearchOptions.ALL:
                orValue.push(
                    {
                        subject: strict ? search : { $regex: regex },
                    },
                    {
                        note: strict ? search : { $regex: regex },
                    },
                    {
                        update: strict ? search : { $regex: regex },
                    },
                );
                break;
            default:
                break;
        }

        let selector: MongoDBSelector = {};

        if (isNonEmptyStr(search)) {
            selector = {
                $or: orValue,
            };
        }

        const [logs, total] = (await Promise.all([
            SystemChangeLogsCollection.find(selector, {
                limit: cleanedLimit,
                skip: (skip > 0 ? skip - 1 : skip) * cleanedLimit,
                sort: { createdAt: -1 },
                fields: {},
            }).fetchAsync(),
            SystemChangeLogsCollection.find(selector).countAsync(),
        ])) as [SystemChangeLogsModel[], number];

        return {
            logs,
            total,
        };
    },
});
