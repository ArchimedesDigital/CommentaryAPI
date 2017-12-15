/**
 * Queries for reference works
 */

import { GraphQLString, GraphQLList } from 'graphql';

// types
import { ReferenceWorkType } from '../types/models/referenceWork';

// logic
import ReferenceWorksService from '../logic/ReferenceWorks/referenceWorks';


const referenceWorkQueryFields = {
	referenceWorks: {
		type: new GraphQLList(ReferenceWorkType),
		description: 'Get list of reference works',
		args: {
			tenantId: {
				type: GraphQLString,
			},
			id: {
				type: GraphQLString,
			}
		},
		resolve: (parent, { tenantId, id }, {token}) =>
			ReferenceWorksService.referenceWorksGet(id, tenantId).then(function(referenceWorks) {
				return referenceWorks;
			})
	},
};

export default referenceWorkQueryFields;