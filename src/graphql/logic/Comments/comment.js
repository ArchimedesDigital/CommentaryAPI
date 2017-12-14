import Comments from '../../../models/comments';
import Commenters from '../../../models/commenters';

// errors
import { AuthenticationError } from '../../errors/index';

import PermissionsService from '../PermissionsService';

import { prepareGetCommentsOptions, getURN } from './helper';

/**
 * Logic-layer service for dealing with comments
 */
export default class CommentService extends PermissionsService {

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
	/**
	 * Update comment
	 * @param {String} id 
	 * @param {object} comment 
	 */
	static commentUpdate(id, comment) {
		if (user.userIsNobody) { // TODO editor or admin
			throw AuthenticationError();
		}
		try {
			commentId = Comments.update({_id: id}, {$set: comment});

		} catch (e) {
			console.log(e);
			return '';
		}
	}
	addRevision(commentId, revision) {
	
		if (this.userIsNobody) {
			throw AuthenticationError();
		}
		const comment = Comments.findOne({ _id: commentId });
		const commenters = Commenters.find().fetch();
	
		let allowedToEdit = false;
		this.user.canEditCommenters.forEach((commenterId) => {
			comment.commenters.forEach((commenter) => {
				commenters.forEach((_commenter) => {
					if (
							commenter.slug === _commenter.slug
						&& _commenter._id === commenterId
					) {
						allowedToEdit = true;
					}
				});
			});
		});
		if (!allowedToEdit) {
			throw AuthenticationError();
		}
		const revisionId = Random.id();
		revision._id = revisionId;
		try {
			Comments.update({
				_id: commentId,
			}, {
				$push: {
					revisions: {...revision},
				},
			});
		} catch (err) {
			throw new Error(`Error adding revision to comment: ${err}`);
		}
		return revisionId;
	}
	removeRevision(commentId, revision) {
		
		if (this.userIsNobody) {
			throw AuthenticationError();
		}

		const revisionId = Random.id();
		revision._id = revisionId;
	
		try {
			Comments.update({
				_id: commentId,
			}, {
				$pull: {
					revisions: revision,
				},
			}, {
				getAutoValues: false,
			});
		} catch (err) {
			throw new Error(`Error adding revision to comment: ${err}`);
		}
		return revisionId;
	}
	
}
