exports.site = {
  url: 'http://achivster.com/',
  port: 8001
};

exports.mongo = {
  db: 'achi',
  db_api: 'achi-api',
  port: 27017,
  host: '127.0.0.1',
  server_config: {
    auto_reconnect: true
  },
  connector_config: {
    safe: true
  }
};

exports.mail = {
  support_name: 'support@achivster.com',
  support_pass: 'AO4dtGvORf'
}

var rootdir = '/var/www/achi';

exports.dirs = {
  root: rootdir,
  uploads: rootdir+'/uploads',
  views: rootdir+'/views',
  public: rootdir+'/public',
  profileImages: rootdir+'/public/images/users_photo',
  writibleProfileImages: '/images/users_photo',
  achievementImages: rootdir+'/public/images/achievements',
  locale: rootdir+'/configs/locale'
}
