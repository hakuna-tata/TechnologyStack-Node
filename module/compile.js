const path = require('path');
const NativeModule = require('module');
const vm = require('vm');

const char = 'module.exports = function() { console.log("test compile") }';

const Module = module.__proto__.constructor;
const m = new Module();
m.path = path.resolve(__dirname);
m.filename = path.resolve(__dirname, 'char.js');

const getModuleFromString = (char) => {
	const wrapper = NativeModule.wrap(char);
	const script = new vm.Script(wrapper, { 
		displayErrors: true
	});

	const result = script.runInThisContext();
	result.call(m.exports, m.exports, require, m);

	return m;
}

const createModule = getModuleFromString(char);

console.log(createModule);
(createModule.exports)();