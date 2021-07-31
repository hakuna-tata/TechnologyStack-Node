const path = require('path');

const plug = (id) => {
    return require(id);
};

if (!global.plug) {
    global.plug = plug;

    plug.__dirname = __dirname;
    plug.parent = path.resolve(__dirname, '..');
    plug.paths = [
        path.resolve(__dirname, 'deps'),
    ]

    module.paths = plug.paths.concat(module.paths);
}

const package = global.plug('package');
package.exec();
