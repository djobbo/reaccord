const readPackage = (pkg) => {
	if (pkg.name && pkg.peerDependencies) {
		pkg.peerDependencies = {}
	}
	return pkg
}

module.exports = {
	hooks: {
		readPackage,
	},
}
