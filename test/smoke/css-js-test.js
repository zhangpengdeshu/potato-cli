const glob = require('glob');
describe('Checking generated css js files', () => {
    it('should generate css files', (done) => {
        const files = glob.sync('./dist/home.css')
        if (files.length > 0) {
            done()
        } else {
            throw new Error('no css files generate')
        }
    })

    it('should generate js files', (done) => {
        const files = glob.sync('./dist/home.*.js')
        if (files.length > 0) {
            done()
        } else {
            throw new Error('no js files generate')
        }
    })
})