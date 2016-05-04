import parse from 'co-busboy';
import devnull from 'dev-null';
import log from 'spm-log';

module.exports = {
  name: 'upload',
  middleware() {
    return function *(next) {
      // the body isn't multipart, so busboy can't parse it
      if (!this.request.is('multipart/*')) {
        return yield next;
      }
      const parts = parse(this);
      let part;

      /* eslint-disable */
      while (part = yield parts) {
        if (part.length) {
          // arrays are busboy fields
          log.info('dora-plugin-upload', `'key: ${part[0]}`);
          log.info('dora-plugin-upload', `'value: ${part[1]}`);
        } else {
          // otherwise, it's a stream
          log.info('dora-plugin-upload', `mocking file upload pipe`);
          part.pipe(devnull());
        }
      }
      log.info('dora-plugin-upload', `'done parsing the upload form!`);
      this.status = 200;
      this.body = {
        'status': 'success',
        'url': '/example.file',
      };
      return null;
    };
  },
};
