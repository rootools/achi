exports.site = {
  url: 'http://rootools.ru/'
};

exports.mongo = {
  db: 'achi',
  port: 27017,
  host: '127.0.0.1',
  server_config: {
    auto_reconnect: true
  },
  connector_config: {
    safe: true
  }
};