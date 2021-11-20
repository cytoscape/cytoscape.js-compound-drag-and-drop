const defaultParams = `
  --require 'test/**/*.js'
  --require 'test/steps/**/*.js'
  --format 'html:test/reports/test_results.html'
  test/features/**/*.feature
  `;

module.exports = {
  ci: `
  --world-parameters '{"ci": "true"}'
  ${defaultParams}
  --exit
  `,
  default: `
  ${defaultParams}
  `
};
