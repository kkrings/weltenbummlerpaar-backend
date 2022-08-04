const transformer = require('@nestjs/swagger/plugin');

module.exports = {
  name: 'nestjs-swagger-transformer',
  version: 1,
  factory: (cs) =>
    transformer.before(
      {
        classValidatorShim: true,
        introspectComments: true,
      },
      cs.program,
    ),
};
