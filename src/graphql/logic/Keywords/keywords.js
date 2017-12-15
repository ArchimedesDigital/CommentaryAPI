import Keywords from '../../../models/keywords';
import PermissionsService from '../PermissionsService';

/**
 * Logic-layer service for dealing with keywords
 */
export default class KeywordsService extends PermissionsService {

	/**
	 * Get tags (keywords) for tenant
	 * @param {string} id - id of a tag
	 * @param {string} tenantId - id of tenant
	 * @returns {Object[]} array of tags 
	 */
	static keywordsGet(id, tenantId, queryParam) {
		let args = {};
		if (queryParam) {
			args = JSON.parse(queryParam);
		}
		if (tenantId) {
			args.tenantId = tenantId;
		}
		if (id) {
			args._id = id;
		}
		return Keywords.find(args).sort({title: 1}).exec();
	}

	/**
	 * Remove a tag
	 * @param {string} keywordId - id of tag to remove
	 * @returns {boolean} result of mongo orm remove
	 */
	keywordRemove(keywordId) {
		if (this.userIsAdmin) {
			return Keywords.remove({_id: keywordId});
		}
		return new Error('Not authorized');
	}

	/**
	 * Update a tag
	 * @param {string} keywordId - id of tag to update
	 * @param {Object} keyword - tag parameters to update
	 * @returns {boolean} result of mongo orm update
	 */
	keywordUpdate(keywordId, keyword) {
		console.log(keyword);
		if (this.userIsAdmin) {
			return Keywords.update(keywordId, {$set: {...keyword}});
		}
		return new Error('Not authorized');
	}
	keywordInsert(keyword) {
		if (this.userIsNobody) {
			return new Error('Not authorized');
		}
		return Keywords.insert({...keyword});
	}
}