const PlanetNames = {
	sun: "sun",
	moon: "moon",
	mercury: "mercury",
	venus: "venus",
	mars: "mars",
	jupiter: "jupiter",
	saturn: "saturn",
	uranus: "uranus",
	neptune: "neptune",
	pluto: "pluto",
}

class Planet {
	constructor(name) {
		self.name = name
	}
}

const Aspects = {
	conjunction: "conjunction",
	opposition: "opposition",
	square: "square",
	trine: "trine",
	sextile: "sextile"
}

class Aspect {
	constructor(name) {
		self.name = name
	}
}

const Signs = {
	aries: "aries",
	taurus: "taurus",
	gemini: "gemini",
	cancer: "cancer",
	leo: "leo",
	virgo: "virgo",
	libra: "libra",
	scorpio: "scorpio",
	sagittarius: "sagittarius",
	capricorn: "capricorn",
	aquarius: "aquarius",
	pisces: "pisces"
}

class Sign {
	constructor(name) {
		this.name = name
	}
}

const Houses = {
	1: "1",
	2: "2",
	3: "3",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	10: "10",
	11: "11",
	12: "12",
}

class House {
	constructor(name) {
		this.name = name
	}
}

