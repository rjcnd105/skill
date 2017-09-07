const fs = require("fs");
let extend = require('util')._extend;



let innerfolders = function(basePath, folders) {
	let obj = {};
	// DEPTH 1

	folders.forEach((dep1folder) => {
		let innerFolders;
		innerFolders = fs.readdirSync(basePath + dep1folder + "/");
		obj[dep1folder] = {};

		// DEPTH 2
		innerFolders.forEach((dep2folder) => {
			let dep2folderPath = basePath + dep1folder + "/" + dep2folder + "/";
			let dep2files = fs.readdirSync(dep2folderPath);
			// util-extend
			extend(obj[dep1folder], dep2files.reduce((o, v) => {
				if(v.match(/\.html/i)){
					let obj = {};
					obj.html = dep2folderPath + v;
					try {
						obj.browser = fs.readFileSync(dep2folderPath + "browser", 'utf8');
					} catch(e){ }
					o[v] = obj;
				}
				return o;
			}, {}));
		});
	});
	return obj;
};

let writeFiles = function(filePath = '/www/motions/', fileName = 'files') {
	let folderPath = process.cwd();
	let basePath = folderPath + filePath;
	let folders = fs.readdirSync(basePath);
	let output = {};

	console.log('currPath : ', folderPath);

	folders = folders.reduce((arr, v)=> {
		if(!v.match(/\./)) return arr.concat(v);
		else return arr;
	}, []);

	output = innerfolders(basePath, folders);

	console.log(output);
	fs.writeFileSync('./www/' + fileName + '.json', JSON.stringify(output));
};

if(process.argv.length > 1){
	writeFiles(process[2]);
}

module.exports = {writeFiles: writeFiles};
