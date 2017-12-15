import _ from 'underscore';
import mongoose from 'mongoose';

import Works, { WorksModel} from './works';
import Books from './books';
import Tenants from './tenants';
import { CommentersModel } from './commenters';
import { SubworksModel } from './subworks';
import { ReferenceWorksModel } from './referenceWorks';
import { KeywordsModel } from './keywords';
import { DiscussionCommentsModel } from './discussionComments';
import { RevisionModel } from './revision';


const CommentsModel = new mongoose.Schema({
	urn: {
		type: Object,
		optional: true,
	},

	originalDate: {
		type: Date,
		optional: true,
	},

	status: {
		type: String,
		optional: true,
	},

	wordpressId: {
		type: Number,
		optional: true,
	},

	tenantId: {
		type: String,
	},

	commenters: {
		type: [CommentersModel],
		optional: true
	},

	users: {
		type: [String],
		optional: true,
	},

	work: {
		type: WorksModel,
		optional: true,

	},

	subwork: {
		type: SubworksModel,
		optional: true,
	},

	lineFrom: {
		type: Number,
		optional: true,
	},

	lineTo: {
		type: Number,
		optional: true,
	},

	lineLetter: {
		type: String,
		optional: true,
	},

	bookChapterUrl: {
		type: String,
		optional: true,
	},

	paragraphN: {
		type: Number,
		optional: true,
	},

	nLines: {
		type: Number,
		optional: true,
	},

	commentOrder: {
		type: Number,
		optional: true,
	},

	parentCommentId: {
		type: String,
		optional: true,
	},
	revisions: {
		type: [RevisionModel],
		optional: true
	},
	referenceId: {
		type: String,
		optional: true,
	},

	referenceWorks: {
		type: [ReferenceWorksModel],
		optional: true,
	},

	keywords: {
		type: [KeywordsModel],
		optional: true,
	},

	discussionComments: {
		type: [DiscussionCommentsModel],
		optional: true,
	},

	isAnnotation: {
		type: Boolean,
		optional: true,
	},

	discussionCommentsDisabled: {
		type: Boolean,
		optional: true,
	},

	created: {
		type: Date,
		optional: true,
	},

	updated: {
		type: Date,
		optional: true,
	},
});


const COMMENT_ID_LENGTH = 7;

const _getCommentURN = (comment) => {
	const work = Works.findOne({ slug: comment.work.slug });
	const tenant = Tenants.findOne({_id: comment.tenantId});
	const urnPrefixV1 = 'urn:cts:CHS.Commentary';
	const urnPrefixV2 = `urn:cts:CHS:Commentaries. ${tenant.subdomain.toUpperCase()}`;
	// Use work tlg if it exists, otherwise, search for subwork tlg number
	// Failing either, just use creator
	let urnTLG = work.tlgCreator;
	if (work.tlg && work.tlg.length) {
		urnTLG += `.${work.tlg}`;
	} else {
		work.subworks.forEach((subwork) => {
			if (
					subwork.n === comment.subwork.n
				&& subwork.tlgNumber
				&& subwork.tlgNumber.length
			) {
				urnTLG += `.${subwork.tlgNumber}`;
			}
		});
	}

	//
	urnTLG += '.chsCommentary';
	const workTitle = comment.work.title.replace(' ', '');

	let urnComment = `${workTitle}.${comment.subwork.title}.${comment.lineFrom}`;

	if (typeof comment.lineTo !== 'undefined' && comment.lineFrom !== comment.lineTo) {
		urnComment += `-${comment.subwork.title}.${comment.lineTo}`;
	}

	const urnCommentId = `${comment._id.slice(-COMMENT_ID_LENGTH)}`;
	return {
		v1: `${urnPrefixV1}:${urnComment}.${urnCommentId}`,
		v2: `${urnPrefixV2}:${urnComment}.${urnCommentId}`};
};

const _getAnnotationURN = (comment) => {
	const book = Books.findOne({ 'chapters.url': comment.bookChapterUrl });
	const chapter = _.find(book.chapters, c => c.url === comment.bookChapterUrl);
	const tenant = Tenants.findOne({_id: comment.tenantId});
	const urnPrefixV1 = 'urn:cts:CHS.Annotations';
	const urnPrefixV2 = `urn:cts:CHS:Annotations. ${tenant.subdomain.toUpperCase()}`;
	const urnBook = `${book.authorURN}.${book.slug}`;
	const urnComment = `${chapter.n}.${comment.paragraphN}`;
	const urnCommentId = `${comment._id.slice(-COMMENT_ID_LENGTH)}`;

	return {
		v1: `${urnPrefixV1}:${urnComment}.${urnCommentId}`,
		v2: `${urnPrefixV2}:${urnComment}.${urnCommentId}`};
};

function getURN(comment) {
	if (comment.isAnnotation) {
		return _getAnnotationURN(comment);
	}

	return _getCommentURN(comment);
}

// hooks:
CommentsModel.pre('insert', function(userId, doc) {
	doc.urn = getURN(doc);
});

CommentsModel.pre('update', function(userId, doc, fieldNames, modifier, options) {
	modifier.$set.urn = getURN(doc);
});

const Comments = mongoose.model('Comments', CommentsModel);

export default Comments;
export { getURN };