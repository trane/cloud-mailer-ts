module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier/@typescript-eslint', // use eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'plugin:import/typescript', // https://github.com/benmosher/eslint-plugin-import#typescript
		'plugin:prettier/recommended', // disable eslint rules that do code formatting
	],
	plugins: ['filenames', '@typescript-eslint'],
	rules: {
		'prefer-template': ['error'],
		'filenames/match-regex': [2, '^[a-z_]+(?:\\.stories|\\.test|\\.d)?$', true], // require snake-case file names
		'filenames/match-exported': [2, 'snake'], // ClassName -> class_name.ts
		'@typescript-eslint/no-angle-bracket-type-assertion': 0, // disable, because it was merged into v2's consistent-type-assertions but still present in other package/plugins
		'@typescript-eslint/no-explicit-any': 0, // disable, we use any explicitly when interfacing with other javascript libs
		'@typescript-eslint/no-empty-function': 'off', // requires a lot of changes in our repo
		'@typescript-eslint/explicit-function-return-type': 0, // this is pretty annoying for react when using const
		'@typescript-eslint/prefer-interface': 0, // this is an old idea left over from when interface was richer than type, no longer applies
		'@typescript-eslint/explicit-member-accessibility': [
			2,
			{ accessibility: 'no-public' }, // public by default, explicit private
		],
	},
	parserOptions: {
		ecmaVersion: 2018, // allow modern ecmascript features
		sourceType: 'module', // allow use of imports
		ecmaFeatures: {
			jsx: true,
		},
		project: ['./tsconfig.json'], // handle where eslint can't load async rules
		tsconfigRootDir: __dirname, // handle where eslint can't load async rules
	},
	settings: {
		'import/resolver': {
			'node': {
				'extension': ['.ts'],
			},
		},
	},
};
