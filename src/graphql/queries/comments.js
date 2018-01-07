/**
 * Queries for comments
 */

import { GraphQLID, GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';

// types
import CommentType from '../types/comment';

// logic
import CommentService from '../logic/Comments/comments';

const commentQueryFields = {
	comments: {
		type: new GraphQLList(CommentType),
		description: 'Get list of all comments by tenant or for a specific work/passage',
		args: {
			queryParam: {
				type: GraphQLString,
			},
			limit: {
				type: GraphQLInt,
			},
			skip: {
				type: GraphQLInt,
			},
			sortRecent: {
				type: GraphQLBoolean
			}
		},
		resolve(parent, { queryParam, limit, skip, sortRecent}, {token}) {
			return CommentService.commentsGet(queryParam, limit, skip, sortRecent).then(function(comments) {
				return comments;
			});
		}
	},
	commentsMore: {
		type: GraphQLBoolean,
		description: 'Find if there is more comments to take',
		args: {
			queryParam: {
				type: GraphQLString,
			},
			limit: {
				type: GraphQLInt,
			},
			skip: {
				type: GraphQLInt,
			},
		},
		resolve: (parent, { queryParam, limit, skip}, {token}) =>
			CommentService.commentsGetMore(queryParam, limit, skip).then(function(comments) {
				const tempLimit = limit !== undefined && limit !== null ? limit : 30;
				return comments.length > tempLimit;
			})
	},
	commentsOn: {
		type: new GraphQLList(CommentType),
		description: 'Get list of comments via urn and paginated via skip/limit. Relates a scholion to the passage of text it comments on.',
		args: {
			urn: {
				type: GraphQLString,
				required: true,
			},
			limit: {
				type: GraphQLInt,
			},
			skip: {
				type: GraphQLInt,
			},
		},
		resolve: (parent, { urn, limit, skip }, { token }) =>
			CommentService.commentsGetURN(urn, limit, skip).then(function(comments) {
				comments.map((comment) => {
					try {
						comment.urn = JSON.parse(comment.urn);
					} catch (e) {
						console.log(e);
					}
					return comment;
				});
				return comments;
			})
	},
	commentedOnBy: {
		type: new GraphQLList(CommentType),
		description: 'Get list of comments provided at a and paginated via skip/limit. Relates a passage of text to a scholion commenting on it.',
		args: {
			urn: {
				type: GraphQLString,
				required: true,
			},
			commenterId: {
				type: GraphQLString,
				required: true,
			},
			limit: {
				type: GraphQLInt,
			},
			skip: {
				type: GraphQLInt,
			},
		},
		resolve: (parent, { urn, commenterId, limit, skip }, { token }) =>
			CommentService.commentsGetCommentedOnBy(urn, commenterId, limit, skip).then(function(comment) {
				return comment;
			})
	},
	commentsByUrns: {
		type: new GraphQLList(CommentType),
		description: 'Get comments which urns was passed in argument of this query',
		args: {
			urns: {
				type: new GraphQLList(GraphQLString),
				required: true
			},
			limit: {
				type: GraphQLInt
			},
			skip: {
				type: GraphQLInt
			}
		},
		resolve: (parent, { urns, limit, skip }, { token }) =>
		CommentService.commentsGetByUrnsList(urns, limit, skip).then(function(comments) {
			return comments;
		})
	}
};

export default commentQueryFields;
