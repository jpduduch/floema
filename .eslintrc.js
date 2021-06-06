module.exports = {
	root: true,
	extends: ['standard'],
	globals: {
		'IS_DEVELOPMENT': 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2020
	}
}

// este arquivo faz com que a estrutura do código seja colocada em um padrão. se vc fizer algo fora do padrão, ele corrige automaticamente. Ex.: se vc setar o js pra ficar sem ; ao final das linhas, toda vez que vc colocar, ele atualiza automaticamente
