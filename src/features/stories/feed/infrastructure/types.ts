export interface ApiStoryCity {
	countryISO2: string;
	cityISO2: string;
}

export interface ApiStory {
	id: string;
	videoUrl: string;
	thumbnailUrl: string;
	processingStatus: 'processing' | 'ready' | 'failed';
	title?: string;
	description?: string;
	cities: ApiStoryCity[];
	createdAt: string;
	updatedAt: string;
	teacher?: {
		id: string;
		name: string;
		surname: string;
		avatar?: string;
	};
}
