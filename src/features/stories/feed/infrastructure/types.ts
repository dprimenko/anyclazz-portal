export interface ApiStoryCity {
	countryISO2: string;
	cityISO2: string;
}

export interface ApiStory {
	id: string;
	videoUrl: string;
	title?: string;
	description?: string;
	cities: ApiStoryCity[];
	createdAt: string;
	updatedAt: string;
}
