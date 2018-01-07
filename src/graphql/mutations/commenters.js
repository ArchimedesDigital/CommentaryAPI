/**
 * Mutations for commenters
 */

import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import { CommenterType, CommenterInputType } from '../types/commenter';
import RemoveType from '../types/remove';

// logic
import CommentersService from '../logic/Commenters/commenters';

const commenterMutationFields = {

	commenterRemove: {
		type: RemoveType,
		description: 'Remove a single commenter',
		args: {
			commenterId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve (parent, {commenterId}, { token }) {
			const commentersService = new CommentersService({ token });
			return commentersService.commenterRemove(commenterId);
		}
	},
	commenterUpdate: {
		type: CommenterType,
		description: 'Update a commenter',
		args: {
			commenterId: {
				type: new GraphQLNonNull(GraphQLString)
			},
			commenter: {
				type: CommenterInputType
			}
		},
		async resolve (parent, {commenterId, commenter}, { token }) {
			const commentersService = new CommentersService({ token });
			return commentersService.commenterUpdate(commenterId, commenter);
		}
	},
	commenterCreate: {
		type: CommenterType,
		description: 'Create a commenter',
		args: {
			commenter: {
				type: CommenterInputType
			}
		},
		async resolve (parent, {commenter}, { token }) {
			const commentersService = new CommentersService({ token });
			return commentersService.commenterCreate(commenter);
		}
	}
};

export default commenterMutationFields;
