
/**
 * Column sizes for categories
 */
enum sizes {
	small = 'small',
	medium = 'medium',
	large = 'large'
}

/**
 * Style classes for categories
 */
enum styles {
	style1 = 'gradient-white',
	style2 = 'gradient-navy',
	style3 = 'gradient-clay',
	style4 = 'gradient-jade',
	style5 = 'gradient-teal',
	style6 = 'gradient-black',
	style7 = 'gradient-gray',
	style8 = 'gradient-green',
}

interface ServerProductMetaUi {
	size: sizes,
	style: styles
}

export {
	sizes,
	styles,
	ServerProductMetaUi
}

