import Boom from 'boom';

export default function registerDelete(server) {
  server.route({
    path: '/api/kibana/settings/{key}',
    method: 'DELETE',
    handler: function (req, reply) {
      const { key } = req.params;
      const uiSettings = req.getUiSettingsService();

      uiSettings
        .remove(key)
        .then(() => uiSettings
          .getUserProvided()
          .then(settings => reply({ settings }).type('application/json'))
        )
        .catch(err => reply(Boom.wrap(err, err.statusCode)));
    }
  });
}
