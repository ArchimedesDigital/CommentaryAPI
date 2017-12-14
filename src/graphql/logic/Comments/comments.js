import Comments from '../../../models/comments';
// errors
import { AuthenticationError } from '../../errors/index';

import PermissionsService from '../PermissionsService';

import { prepareGetCommentsOptions, getURN } from './helper';

/**
 * Logic-layer service for dealing with comments
 */
export default class CommentService extends GraphQLService {

	/**
	 * Get comments for admin interface
	 * @param {string} queryParam - query describing comments to get
	 * @param {number} limit - mongo orm limit
	 * @param {number} skip - mongo orm skip
	 * @param {boolean} sortRecent - if should sort in the recent sequence
	 * @returns {Object[]} array of comments
	 */
	static commentsGet(queryParam, limit, skip, sortRecent) {

		const options = prepareGetCommentsOptions(limit, skip);
		let query = JSON.parse(queryParam);
		console.log(query);
		if (queryParam === null) {
			query = {};
		}
		query.isAnnotation = {$ne: true};
		const comments = Comments.find(query, options).fetch();
		return comments;
	}
		/**
	 * Get comments for admin interface
	 * @param {string} queryParam - query describing comments to get
	 * @param {number} limit - mongo orm limit
	 * @param {number} skip - mongo orm skip
	 * @returns {boolean} is there any other comments which are possible to get
	 */
	static commentsGetMore(queryParam, limit, skip) {
		if (!queryParam && !limit && !skip) {
			return false;
		}
		try { 
			const MAX_LIMIT = 1000;
			// const args = prepareGetCommentsArgs(workSlug, subworkN, tenantId);
			const options = prepareGetCommentsOptions(MAX_LIMIT, skip);
			let query = JSON.parse(queryParam);
			if (queryParam === null) {
				query = {};
			}
			const comments = Comments.find(query, options).fetch();
			return comments.length > limit;
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 * Get comments via a start URN and end URN
	 * @param {string} urnStart - urn start range
	 * @param {string} urnEnd - urn end range
	 * @param {number} limit - mongo orm limit
	 * @param {number} skip - mongo orm skip
	 * @returns {Object[]} array of comments
	 */
	static commentsGetURN(urnStart, urnEnd, limit = 20, skip = 0) {
		const args = {};
		const options = prepareGetCommentsOptions(skip, limit);

		const comments = Comments.find(args, options).fetch();
		comments.map((comment) => {
			try {
				comment.urn = JSON.parse(comment.urn);
			} catch (e) {
				console.log(e);
			}
		});
		return comments;
	}

	/**
	 * Remove a comment
	 * @param {string} _id - comment id to remove
	 * @returns {boolean} result of mongo orm remove
	 */
	commentRemove(_id) {
		if (this.userIsAdmin) {
			return Comments.remove({ _id });
		}
		throw AuthenticationError();
	}
	/**
	 * Add a comment
	 * @param {object} comment - comment to insert
	 */
	commentInsert(comment) {
		if (this.userIsNobody) {
			throw AuthenticationError();
		}
		let commentId;
		let ret;
		try {
			commentId = Comments.insert({...comment});
			ret = Comments.findOne({_id: commentId});
			ret.urn = getURN(ret);
			Comments.update({_id: commentId}, {$set: {urn: ret.urn}});
		} catch (e) {
			console.log(e);
			return '';
		}
		return Comments.findOne({_id: commentId});
	}
}
