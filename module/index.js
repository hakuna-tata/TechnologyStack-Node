console.log(module);

const Module = module.__proto__.constructor;

console.log(Module);
console.log(Module.prototype);

console.log(new Module('./test.js'))
