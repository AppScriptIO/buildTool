const path = require('path')

module.exports = Object.assign({}, 
    {
        directory: {
            root: path.resolve(`${__dirname}/..`)
        },
        ConfigPath: __dirname,
    }
)