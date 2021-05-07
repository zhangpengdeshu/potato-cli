const assert = require('assert');
describe('webpack.base.conf.js test case', () => {
    const baseConfig = require('../../lib/webpack.base.conf');
    it('entry', () => {
        assert.equal(baseConfig.entry.home, '/Users/zhangpeng/code/frontend/project/learn/webpack/build-webpack/test/smoke/template/src/home/index.js')
    })
})