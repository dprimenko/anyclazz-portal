import { ClassType, type DeleteTeacherParams, type GetTeacherParams, type ListTeachersParams, type ListTeachersResponse, type Teacher, type TeacherAddress, type TeacherLanguage, type TeacherRepository, type TeacherSubject } from '../domain/types';

const teachers = <Teacher[]>[
	{
		id: '1',
		name: 'James',
		surname: 'Mitchell',
		email: 'john.doe@example.com',
		avatar: 'https://anyclazz.b-cdn.net/5fd301ae7fbc505a1f7be380dacafdfb10005231.jpg',
		subjects: <TeacherSubject[]>[
			{
				id: '1',
				name: {
					en: 'Math',
					es: 'Matemáticas',
				},
			}
		],
		classTypes: [
			{
				type: ClassType.onlineSingle,
				price: {
					amount: 17,
					currency: 'eur',
				}
			},
		],
		reviewsNumber: 202,
		studentsNumber: 89,
		lessonsNumber: 2130,
		isSuperTeacher: false,
		speaksLanguages: <TeacherLanguage[]>[
			{
				language: 'es',
				proficiencyLevel: 'native',
			},
			{
				language: 'en',
				proficiencyLevel: 'b2',
			}
		],
		shortPresentation: "Hello! My name is James Mitchell, and I'm a certified Spanish teacher from Madrid, Spain. I hold a Master's degree in Education.",
		teacherAddress: <TeacherAddress>{
			countryISO2: 'ES',
			cityISO2: 'ES-M',
			fullAddress: 'Calle de Alcalá, 42, Madrid, Spain',
		},
		beganTeachingAt: '2015-09-10T10:26:34.468Z',
		createdAt: '2025-10-07T10:26:34.468Z',
	},
	{
		id: '2',
		name: 'Valentina',
		surname: 'Harper',
		email: 'valentina.harper@example.com',
		avatar: 'https://anyclazz.b-cdn.net/43306c6f117bd1e44cfa1bac6ff614b579fbbc6a.jpg',
		subjects: <TeacherSubject[]>[
			{
				id: '2',
				name: {
					en: 'Science',
					es: 'Ciencias',
				},
			}
		],
		classTypes: [
		    {	
			    type: ClassType.onlineSingle,
				price: {
					amount: 15,
					currency: 'eur',
				}
			},
			{
				type: ClassType.onlineGroup,
				price: {
					amount: 10,
					currency: 'eur',
				}
			},
			{
				type: ClassType.onsiteSingle,
				price: {
					amount: 25,
					currency: 'eur',
				}
			},
			{
				type: ClassType.onsiteGroup,
				price: {
					amount: 18,
					currency: 'eur',
				}
			},
		],
		reviewsNumber: 405,
		studentsNumber: 130,
		lessonsNumber: 3850,
		isSuperTeacher: true,
		speaksLanguages: <TeacherLanguage[]>[
			{
				language: 'en',
				proficiencyLevel: 'native',
			}
		],
		shortPresentation: "Hello! My name is Valentina Harper, and I'm a certified English teacher based in Madrid, ES. I hold a Master's degree in Science.",
		teacherAddress: <TeacherAddress>{
			countryISO2: 'ES',
			cityISO2: 'ES-M',
			fullAddress: 'Calle de Alcalá, 42, Madrid, Spain',
		},
		beganTeachingAt: '2015-09-10T10:26:34.468Z',
		createdAt: '2025-10-07T10:26:34.468Z',
	},
	{
		id: '3',
		name: 'Marie',
		surname: 'Walls',
		email: 'marie.walls@example.com',
		avatar: 'https://anyclazz.b-cdn.net/bb86af181a995ff3f8897991997ad484c9d3351b.jpg',
		subjects: <TeacherSubject[]>[
			{
				id: '3',
				name: {
					en: 'History',
					es: 'Historia',
				},
			}
		],
		classTypes: [
		    {	
			    type: ClassType.onlineSingle,
				price: {
					amount: 17,
					currency: 'eur',
				}
			},
			{
				type: ClassType.onsiteSingle,
				price: {
					amount: 25,
					currency: 'eur',
				}
			},
			{
				type: ClassType.onsiteGroup,
				price: {
					amount: 12,
					currency: 'eur',
				}
			},
		],
		reviewsNumber: 105,
		studentsNumber: 38,
		lessonsNumber: 150,
		isSuperTeacher: true,
		speaksLanguages: <TeacherLanguage[]>[
			{
				language: 'fr',
				proficiencyLevel: 'native',
			},
			{
				language: 'en',
				proficiencyLevel: 'c1',
			},
		],
		shortPresentation: "Hello! My name is Marie Walls, and I'm a certified French teacher based in Madrid, ES. I hold a Master's degree in History.",
		teacherAddress: <TeacherAddress>{
			countryISO2: 'ES',
			cityISO2: 'ES-M',
			fullAddress: 'Calle de Alcalá, 42, Madrid, Spain',
		},
		beganTeachingAt: '2015-09-10T10:26:34.468Z',
		createdAt: '2025-10-07T10:26:34.468Z',
	},
];

export class MockTeacherRepository implements TeacherRepository {
	async listTeachers(params: ListTeachersParams): Promise<ListTeachersResponse> {
		return Promise.resolve({
			teachers: teachers,
			meta: {
				currentPage: 1,
				lastPage: 1,
				size: 10,
				total: teachers.length,
			},
		});
	}

	async getTeacher(params: GetTeacherParams): Promise<Teacher> {
		return teachers.find((teacher) => teacher.id === params.id)!;
	}

	async createTeacher(teacher: Teacher): Promise<void> {
		teachers.push(teacher);
	}

	async updateTeacher(teacher: Teacher): Promise<void> {
		const index = teachers.findIndex((t) => t.id === teacher.id);
		teachers[index] = teacher;
	}

	async deleteTeacher(params: DeleteTeacherParams): Promise<void> {
		const index = teachers.findIndex((t) => t.id === params.id);
		teachers.splice(index, 1);
	}
}