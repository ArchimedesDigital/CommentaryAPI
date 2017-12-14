import Tenants from '../../../models/tenants';
import PermissionsService from '../PermissionsService';

/**
 * Logic-layer service for dealing with tenants
 */
export default class TenantsService extends PermissionsService {

	/**
	 * Get tenants
	 * @param {string} _id - id of tenant
	 * @returns {Object[]} array of tenants
	 */
	static tenantsGet(_id) {
		
		const args = {};

		if (_id) {
			args._id = _id;
		}

		return Tenants.find(args).fetch();
	}

	/**
	 * Get a tenant by the supplied subdomain
	 * @param {string} subdomain - id of tenant
	 * @returns {Object} found tenant record
	 */
	static tenantBySubdomainGet(subdomain) {
		return Tenants.findOne({
			subdomain,
		});
	}

	/**
	 * Update a tenant
	 * @param {string} _id - id of tenant
	 * @param {Object} tenant - tenant params to update
	 * @returns {Object} tenant record that was found
	 */
	tenantUpdate(_id, tenant) {
		if (this.userIsAdmin) {
			Tenants.update(_id, {$set: tenant});
			return Tenants.findOne(_id);
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a tenant
	 * @param {string} tenantId - id of tenant
	 * @returns {boolean} result from mongo orm remove
	 */
	tenantRemove(tenantId) {
		if (this.userIsAdmin) {
			return Tenants.remove({_id: tenantId});
		}
		return new Error('Not authorized');
	}

	/**
	 * Create a tenant
	 * @param {Object} tenant - candidate tenant to create
	 * @returns {Object} newly created tenant
	 */
	tenantCreate(tenant) {
		if (this.userIsAdmin) {
			const tenantId = Tenants.insert({...tenant});
			return Tenants.findOne(tenantId);
		}
		return new Error('Not authorized');
	}
}
