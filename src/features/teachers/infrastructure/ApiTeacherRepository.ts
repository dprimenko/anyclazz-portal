import { FetchClient } from '@/features/shared/services/httpClient';
import type { ApiTeacher } from './types';
import type { ClassType, GetTeacherParams, ListTeachersParams, ListTeachersResponse, Teacher, TeacherRepository, UpdateTeacherParams } from '../domain/types';
import { getApiUrl } from '@/features/shared/services/environment';

export class ApiTeacherRepository implements TeacherRepository {

	private readonly httpClient: FetchClient;

	constructor() {
		this.httpClient = new FetchClient(getApiUrl());
	}

	private toTeacher(apiTeacher: ApiTeacher): Teacher {
		return {
			...apiTeacher,
			classTypes: apiTeacher.classTypes.map((classType) => ({
				type: classType.type as unknown as ClassType,
				...(classType.durations ? classType.durations.map((duration) => ({
					duration: duration.duration,
					price: {
						amount: duration.price.price,
						currency: duration.price.currencyCode,
					}
				})) : null),
			})),
		};
	}

	async listTeachers({ token, page, size, query }: ListTeachersParams): Promise<ListTeachersResponse> {		
		const data: Record<string, string | number> = {
			page: page,
			size: size,
			...(query ? { query } : {}),
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

	async getTeacher({ token, teacherId}: GetTeacherParams): Promise<Teacher> {		
		const apiTeacherResponse = await this.httpClient.get({
			url: `/teachers/${teacherId}`,
			token: token,
		});

		const apiTeacher = await apiTeacherResponse.json();
		return this.toTeacher(apiTeacher);
	}

	async updateTeacher({ token, teacherId, data }: UpdateTeacherParams): Promise<void> {
		await this.httpClient.put({
			url: `/teachers/${teacherId}`,
			token: token,
			data: {
				...(data.subjectId ? { subjectId: data.subjectId } : {}),
				...(data.subjectCategoryId ? { subjectCategoryId: data.subjectCategoryId } : {}),
				...(data.studentLevelId ? { studentLevelId: data.studentLevelId } : {}),
				...(data.nationalityId ? { nationalityId: data.nationalityId } : {}),
				...(data.address ? { address: data.address } : {}),
				...(data.speaksLanguages ? { speaksLanguages: data.speaksLanguages } : {}),
				...(data.beganTeachingAt ? { beganTeachingAt: data.beganTeachingAt } : {}),
				...(data.shortPresentation ? { shortPresentation: data.shortPresentation } : {}),
			},
		});
	}
}