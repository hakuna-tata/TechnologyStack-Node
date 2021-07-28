const path = require('path');
const NativeModule = require('module');
const vm = require('vm');

const Module = module.__proto__.constructor;
const m = new Module();
m.path = path.resolve(__dirname);
m.filename = path.resolve(__dirname, 'bundle.js');

const getModuleFromString = (bundle) => {
	const wrapper = NativeModule.wrap(bundle);
	const script = new vm.Script(wrapper, { 
		displayErrors: true
	});

	const result = script.runInThisContext();
	result.call(m.exports, m.exports, require, m);

	return m;
}

const createModule = getModuleFromString(require('./char'));

console.log(createModule);
(createModule.exports)();