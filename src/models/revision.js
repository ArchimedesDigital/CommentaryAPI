
import mongoose from 'mongoose';


const RevisionModel = new mongoose.Schema({

	originalDate: {
		type: Date,
		optional: true,
	},
	slug: {
		type: String,
		max: 200,
		optional: true,
	},
	title: {
		type: String
	},
	text: {
		type: String
	},
	tenantId: {
		type: String,
	},

	created: {
		type: Date,
		optional: true,
	},

	createdBy: {
		type: String,
		optional: true,
	},

	updated: {
		type: Date,
		optional: true,
	},
});

const Revisions = mongoose.model('Revisions', RevisionModel);

export default Revisions;
export { RevisionModel };