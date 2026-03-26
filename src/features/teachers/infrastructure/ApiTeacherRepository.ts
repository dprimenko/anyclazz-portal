import { FetchClient } from '@/features/shared/services/httpClient';
import type { ApiTeacher } from './types';
import type { 
	ClassType, 
	CreateReviewParams, 
	CreateReviewResponse, 
	GetTeacherParams, 
	GetTeacherReviewsParams, 
	GetTeacherReviewsResponse, 
	ListTeachersParams, 
	ListTeachersResponse, 
	SaveTeacherParams,
	SaveTeacherResponse,
	Teacher, 
	TeacherRepository, 
	UnsaveTeacherParams,
	UpdateTeacherParams 
} from '../domain/types';
import { getApiUrl } from '@/features/shared/services/environment';
import type { StripeConnectStatusResponse } from '@/features/stripe-connect';

export class ApiTeacherRepository implements TeacherRepository {

	private readonly httpClient: FetchClient;

	constructor() {
		this.httpClient = new FetchClient(getApiUrl());
	}

	private toTeacher(apiTeacher: ApiTeacher): Teacher {
		return {
			...apiTeacher,
			portrait: apiTeacher.portraitImage,
			classTypes: apiTeacher.classTypes.map((classType) => ({
				type: classType.type as unknown as ClassType,
				durations: classType.durations?.map((duration) => ({
					duration: duration.duration,
					price: duration.price ? {
						amount: duration.price.price,
						currency: duration.price.currencyCode,
					} : undefined,
				})),
			})),
		};
	}

	async listTeachers({ token, page, size, query, country, city, classTypeId, minPrice, maxPrice, subjectCategoryId, subjectId, speakLanguage, studentLevelId, savedByStudentId }: ListTeachersParams): Promise<ListTeachersResponse> {		
		const data: Record<string, string | number> = {
			page: page,
			size: size,
			...(query ? { query } : {}),
			...(country ? { country } : {}),
			...(city ? { city } : {}),
			...(classTypeId ? { classTypeId } : {}),
			...(minPrice !== undefined ? { minPrice } : {}),
			...(maxPrice !== undefined ? { maxPrice } : {}),
			...(subjectCategoryId ? { subjectCategoryId } : {}),
			...(subjectId ? { subjectId } : {}),
			...(speakLanguage ? { speakLanguage } : {}),
			...(studentLevelId ? { studentLevelId } : {}),
			...(savedByStudentId ? { savedByStudentId } : {}),
		};

		const apiTeachersResponse = await this.httpClient.get({
			url: '/teachers',
			token: token,
			data,
		});

		const teachers = await apiTeachersResponse.json();
		return {
			teachers: teachers.teachers.map(this.toTeacher),
			meta: teachers.meta,
		};
	}

	async listSavedTeachers({ token, page, size, query }: ListTeachersParams): Promise<ListTeachersResponse> {		
		const data: Record<string, string | number> = {
			page: page,
			size: size,
			...(query ? { query } : {}),
		};

		const apiTeachersResponse = await this.httpClient.get({
			url: '/me/saved-teachers',
			token: token,
			data,
		});

		const result = await apiTeachersResponse.json();
		return {
			teachers: result.teachers.map(this.toTeacher),
			meta: {
				currentPage: result.pagination.page,
				lastPage: result.pagination.lastPage,
				size: result.pagination.size,
				total: result.pagination.total,
			},
		};
	}

	async getTeacher({ token, teacherId}: GetTeacherParams): Promise<Teacher> {		
		const apiTeacherResponse = await this.httpClient.get({
			url: `/teachers/${teacherId}`,
			token: token,
		});

		const apiTeacher = await apiTeacherResponse.json();

		console.log("API Teacher:"); 
		console.log(apiTeacher);
		return this.toTeacher(apiTeacher);
	}

	async updateTeacher({ token, teacherId, data }: UpdateTeacherParams): Promise<void> {
		const baseData = {
			...(data.name !== undefined ? { name: data.name } : {}),
			...(data.surname !== undefined ? { surname: data.surname } : {}),
			...(data.subjectId ? { subjectId: data.subjectId } : {}),
			...(data.subjectCategoryId ? { subjectCategoryId: data.subjectCategoryId } : {}),
			...(data.studentLevelId ? { studentLevelId: data.studentLevelId } : {}),
			...(data.nationalityId ? { nationalityId: data.nationalityId } : {}),
			...(data.address ? { address: data.address } : {}),
			...(data.timezone !== undefined ? { timezone: data.timezone } : {}),
			...(data.speaksLanguages ? { speaksLanguages: data.speaksLanguages } : {}),
			...(data.beganTeachingAt ? { beganTeachingAt: data.beganTeachingAt } : {}),
			...(data.shortPresentation !== undefined ? { shortPresentation: data.shortPresentation } : {}),
			...(data.about !== undefined ? { about: data.about } : {}),
			...(data.videoPresentation !== undefined ? { videoPresentation: data.videoPresentation } : {}),
			...(data.academicBackground !== undefined ? { academicBackground: data.academicBackground } : {}),
			...(data.certifications !== undefined ? { certifications: data.certifications } : {}),
			...(data.skills !== undefined ? { skills: data.skills } : {}),
		};

		const hasFiles = Boolean(data.avatar || data.portrait || (data.videoPresentation instanceof File));
		if (hasFiles) {
			await this.httpClient.postFormData({
				url: `/teachers/${teacherId}`,
				token: token,
				data: {
					...baseData,
					...(data.avatar ? { avatar: data.avatar } : {}),
					...(data.portrait ? { portraitImage: data.portrait } : {}),
					...(data.videoPresentation instanceof File ? { videoPresentation: data.videoPresentation } : {}),
				},
			});
			return;
		}

		await this.httpClient.post({
			url: `/teachers/${teacherId}`,
			token: token,
			data: baseData,
		});
	}

	async getTeacherReviews({ token, teacherId, page = 1, size = 10 }: GetTeacherReviewsParams): Promise<GetTeacherReviewsResponse> {
		const data: Record<string, string | number> = {
			page,
			size,
		};

		const response = await this.httpClient.get({
			url: `/teachers/${teacherId}/reviews`,
			token: token,
			data,
		});

		const reviewsData = await response.json();
		return {
			reviews: reviewsData.reviews,
			meta: reviewsData.meta,
		};
	}

	async createReview({ token, teacherId, rating, comment }: CreateReviewParams): Promise<CreateReviewResponse> {
		const response = await this.httpClient.post({
			url: `/teachers/${teacherId}/reviews`,
			token: token,
			data: {
				rating,
				comment,
			},
		});

		return response.json();
	}

	async saveTeacher({ token, teacherId }: SaveTeacherParams): Promise<SaveTeacherResponse> {
		const response = await this.httpClient.post({
			url: `/me/saved-teachers/${teacherId}`,
			token: token,
		});

		return response.json();
	}

	async unsaveTeacher({ token, teacherId }: UnsaveTeacherParams): Promise<SaveTeacherResponse> {
		const response = await this.httpClient.delete({
			url: `/me/saved-teachers/${teacherId}`,
			token: token,
		});

		return response.json();
	}

	async getStripeConnectStatus({ token }: { token: string }): Promise<StripeConnectStatusResponse> {
		const response = await this.httpClient.get({
			url: '/teachers/me/stripe-connect/status',
			token,
		});

		return response.json();
	}
}