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
				durations: classType.durations.map((duration) => ({
					duration: duration.duration,
					price: {
						amount: duration.price.price,
						currency: duration.price.currencyCode,
					}
				}))
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

		console.log('apiTeacherResponse');

		const apiTeacher = await apiTeacherResponse.json();
		console.log(apiTeacherResponse);

		return this.toTeacher(apiTeacher);
	}

	async updateTeacher({ token, teacherId, data }: UpdateTeacherParams): Promise<Teacher> {
		const apiTeacherResponse = await this.httpClient.put({
			url: `/teachers/${teacherId}`,
			token: token,
			data: data,
		});

		const apiTeacher = await apiTeacherResponse.json();
		return this.toTeacher(apiTeacher);
	}
}