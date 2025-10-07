import { getOidc } from '../../../Auth/oidc';
import { getApiUrl } from '../../../Shared/services/environment';
import { FetchClient } from '../../../Shared/services/httpClient';
import { ListTeachersParams, ListTeachersResponse, Teacher, TeacherRepository } from '../domain/types';
import type { ApiTeacher } from './types';

export class ApiTeacherRepository implements TeacherRepository {

	private readonly httpClient: FetchClient;

	constructor() {
		this.httpClient = new FetchClient(getApiUrl());
	}

	private toListTeacher(apiTeacher: ApiTeacher): Teacher {
		return {
			id: apiTeacher.id,
			name: apiTeacher.name,
			surname: apiTeacher.surname,
			email: apiTeacher.email,
			subjects: apiTeacher.subjects,
			classTypes: apiTeacher.classTypes,
			about: apiTeacher.about,
			beganTeachingAt: apiTeacher.beganTeachingAt,
			createdAt: apiTeacher.createdAt,
			id: '',
			name: '',
			surname: '',
			email: '',
			subjects: [],
			classTypes: [],
			isSuperTeacher: false,
			speaksLanguages: [],
			beganTeachingAt: '',
			teacherAddress: apiTeacher.teacherAddress,
		};
	}

	async listTeachers({ page, size, query }: ListTeachersParams): Promise<ListTeachersResponse> {
		const data: Record<string, string | number> = {
			page: page,
			size: size,
			...(query ? { query } : {}),
		};

		const oidc = await getOidc();
		const { accessToken } = await oidc.getTokens();

		const apiTeachersResponse = await this.httpClient.get({
			url: '/teachers',
			token: accessToken,
			data,
		});

		const teachers = await apiTeachersResponse.json();
		return {
			teachers: teachers.teachers.map((teacher: ApiTeacher) => this.toListTeacher(teacher)),
			meta: teachers.meta,
		};
	}
}