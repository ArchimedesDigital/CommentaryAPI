/**
 * Mutations for comments
 */

import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import CommentType, { CommentInputType } from '../types/models/comment';
import { RevisionInputType } from '../types/models/revision';
import { RemoveType } from '../types/index';

// logic
import CommentService from '../logic/Comments/comment';


const commentMutationFields = {
	commentInsert: {
		type: CommentType,
		description: 'Create new comment',
		args: {
			comment: {
				type: new GraphQLNonNull(CommentInputType)
			}
		},
		resolve(parent, {comment}, {token}) {
			const commentsService = new CommentService({token});
			return commentsService.commentInsert(comment).then(function(_comment) {
				return _comment;
			});
		}
	},
	commentUpdate: {
		type: CommentType,
		description: 'Update comment',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLString)
			},
			comment: {
				type: new GraphQLNonNull(CommentInputType)
			}
		},
		resolve(parent, {id, comment}, {token}) {
			const commentsService = new CommentService({token});
			return commentsService.commentUpdate(id, comment).then(function(_comment) {
				return _comment._id;
			});
		}
	},
	commentRemove: {
		type: RemoveType,
		description: 'Remove a single comment',
		args: {
			commentId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		resolve(parent, {commentId}, {token}) {
			const commentsService = new CommentService({token});
			return commentsService.commentRemove(commentId).then(function(_comment) {
				return _comment._id;
			});
		}
	},
	commentInsertRevision: {
		type: CommentType,
		description: 'Add new revision',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLString)
			},
			revision: {
				type: new GraphQLNonNull(RevisionInputType)
			}
		},
		resolve(parent, {id, revision}, {token}) {
			const commentsService = new CommentService({token});
			return commentsService.addRevision(id, revision).then(function(_comment) {
				return _comment._id;
			});
		}
	},
	commentRemoveRevision: {
		type: RemoveType,
		description: 'Remove a single comment',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		resolve(parent, {id}, {token}) {
			const commentsService = new CommentService({token});
			return commentsService.removeRevision(id).then(function(_comment) {
				return _comment._id;
			});
		}
	}
};



export default commentMutationFields;