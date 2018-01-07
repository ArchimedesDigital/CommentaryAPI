/**
 * Mutations for text nodes
 */

import {
	GraphQLString,
	GraphQLObjectType,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLList
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';


// types
import { TextNodeType, TextNodeInputType } from '../types/textNode';
import RemoveType from '../types/remove';

// logic
import TextNodeService from '../logic/TextNodes/textNodes';

const textNodeMutationFields = {
	textNodeCreate: {
		type: TextNodeType,
		description: 'Create new textNode',
		args: {
			textNode: {
				type: new GraphQLNonNull(TextNodeInputType),
			},
		},
		resolve: (parent, { textNode }, { token }) => {
			const textNodeService = new TextNodeService({token});
			return textNodeService.textNodeCreate(textNode);
		}
	},
	// _id, editionId, updatedText, updatedTextN)
	textNodeUpdate: {
		type: TextNodeType,
		description: 'Update textNode',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLString),
			},
			editionId: {
				type: new GraphQLNonNull(GraphQLString),
			},
			updatedText: {
				type: new GraphQLNonNull(GraphQLString)
			},
			updatedTextN: {
				type: new GraphQLNonNull(GraphQLInt)
			}
		},
		resolve: (parent, { id, editionId, updatedText, updatedTextN }, { token }) => {
			const textNodeService = new TextNodeService({token});
			return textNodeService.textNodeUpdate(id, editionId, updatedText, updatedTextN);
		}
	},
	textNodeRemove: {
		type: RemoveType,
		description: 'Remove a single text node',
		args: {
			textNodeId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		resolve: (parent, {textNodeId}, {token}) => {
			const textNodeService = new TextNodeService({token});
			return textNodeService.textNodeRemove(textNodeId);
		}
	},
	getMaxLine: {
		type: GraphQLString,
		description: 'Get max line',
		args: {
			workSlug: {
				type: new GraphQLNonNull(GraphQLString)
			},
			subworkN: {
				type: new GraphQLNonNull(GraphQLInt)
			}
		},
		resolve(parent, {workSlug, subworkN}, {token}) {
			// TextNodeService.getMaxLine(workSlug, subworkN).then(function(maxLine) {
			// 	return maxLine;
			// })
			// TOD0
			return 1;

		}
	}
};

export default textNodeMutationFields;
