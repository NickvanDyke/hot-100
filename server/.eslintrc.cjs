module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es2021": true,
		"mocha": true,
		"chai": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:mocha/recommended"
	],
	"parserOptions": {
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": "latest"
	},
	"plugins": [
		"mocha"
	],
	"rules": {
		"no-unused-vars": "warn"
	}
}
