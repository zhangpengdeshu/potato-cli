const assert = require('assert');
describe('webpack.base.conf.js test case', () => {
    const baseConfig = require('../../lib/webpack.base.conf');
    it('entry', () => {
        assert.equal(baseConfig.entry.home.indexOf('/src/home/index.js') > -1, true)
    })
})