const path = require('path');

const depend = (id) => {
    return require(id);
};

if (!global.depend) {
    global.depend = depend;

    depend.__dirname = __dirname;
    depend.parent = path.resolve(__dirname, '..');
    depend.paths = [
        path.resolve(__dirname, 'deps'),
    ]

    module.paths = depend.paths.concat(module.paths);
}

const package = global.depend('package');
package.exec();
