import { flatten } from 'lodash';
import { SavedObjectsClient } from '../../../../../server/saved_objects';

export async function importDashboards(req) {
  const { payload } = req;
  const config = req.server.config();
  const overwrite = 'force' in req.query && req.query.force !== false;
  const exclude = flatten([req.query.exclude]);

  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('admin');
  const callAdminCluster = (...args) => callWithRequest(req, ...args);
  const savedObjectsClient = new SavedObjectsClient(config.get('kibana.index'), callAdminCluster);


  const docs = payload.objects
    .filter(item => !exclude.includes(item.type));

  const objects = await savedObjectsClient.bulkCreate(docs, { overwrite });
  return { objects };
}
