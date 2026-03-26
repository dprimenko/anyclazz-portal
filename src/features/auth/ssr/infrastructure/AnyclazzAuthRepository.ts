import type { Session } from "@auth/core/types";
import type { AuthRepository, AuthUser, ProfileApiResponse } from "../../domain/types";
import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';
import { UserCache } from '../../infrastructure/userCache';
import { isSuperTutor } from "@/features/teachers/utils/superTutorHelpers";

export class AnyclazzAuthRepository implements AuthRepository {
    private readonly httpClient: FetchClient;
    private readonly cache: UserCache;

    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
        this.cache = new UserCache();
    }

    private async fetchUserProfile(accessToken: string): Promise<ProfileApiResponse | null> {
        try {
            const response = await this.httpClient.get({
                url: '/profile/me',
                token: accessToken,
            });

            // Verificar content-type antes de parsear JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Invalid response content-type:', contentType);
                console.error('Response body:', text.substring(0, 200));
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    async getUserProfile(accessToken: string): Promise<ProfileApiResponse | null> {
        return this.fetchUserProfile(accessToken);
    }

    async getCurrentUser(session: Session | null): Promise<AuthUser | null> {
        if (!session?.user) {
            // Si no hay sesión, limpiar el caché
            this.cache.clear();
            return null;
        }

        // Intentar obtener del caché primero
        const cachedUser = this.cache.get();
        if (cachedUser && cachedUser.id === session.platformId) {
            console.log('📦 User loaded from cache');
            return cachedUser;
        }

        // Obtener el access token de la sesión
        const accessToken = (session as any).accessToken;
        
        if (!accessToken) {
            console.warn('No access token found in session');
            const sessionRole = (session as any).userRole;
            // Validar que el rol sea uno de los permitidos
            const validRole = (sessionRole === 'admin' || sessionRole === 'teacher' || sessionRole === 'student') 
                ? sessionRole 
                : 'student';
            const fallbackUser = {
                id: session.platformId || '',
                email: session.user.email || '',
                name: session.user.name || '',
                role: validRole,
            };
            this.cache.save(fallbackUser);
            return fallbackUser;
        }

        // Obtener datos completos del perfil desde el API
        const profileData = await this.fetchUserProfile(accessToken);

        if (!profileData) {
            // Fallback a datos de sesión si falla el API
            const sessionRole = (session as any).userRole;
            const validRole = (sessionRole === 'admin' || sessionRole === 'teacher' || sessionRole === 'student') 
                ? sessionRole 
                : 'student';
            const fallbackUser = {
                id: session.platformId || '',
                email: session.user.email || '',
                name: session.user.name || '',
                role: validRole,
            };
            // No guardar en caché si falló el API, usar el caché existente si hay
            return cachedUser || fallbackUser;
        }

        // Determinar el rol basado en el selectedRoleForSession de la sesión
        // Esto respeta la selección del usuario en el selector de roles
        const selectedRole = (session as any).userRole || 'student';
        
        // PRIORIDAD 1: Verificar si el usuario tiene rol de admin
        // Los usuarios admin no tienen studentProfile ni teacherProfile
        const hasAdminRole = selectedRole === 'admin' || 
                            profileData.roles.includes('ROLE_ADMIN') || 
                            profileData.roles.includes('admin');
        
        let role: 'student' | 'teacher' | 'admin';
        let profile: any = null;
        
        if (hasAdminRole) {
            role = 'admin';
            console.log('✅ Usuario admin confirmado desde API');
        } else {
            // PRIORIDAD 2: Validar que el usuario tenga el rol seleccionado
            const hasSelectedRole = selectedRole === 'teacher' 
                ? profileData.roles.includes('ROLE_TEACHER')
                : profileData.roles.includes('ROLE_STUDENT');
            
            // Si no tiene el rol seleccionado, usar el primero disponible
            role = hasSelectedRole 
                ? (selectedRole as 'student' | 'teacher')
                : (profileData.roles.includes('ROLE_STUDENT') ? 'student' : 'teacher');
            
            profile = role === 'student' ? profileData.studentProfile : profileData.teacherProfile;
        }

        const user: AuthUser = {
            id: profileData.user.id,
            email: profileData.user.email,
            name: `${profileData.user.firstName} ${profileData.user.lastName}`,
            firstName: profileData.user.firstName,
            lastName: profileData.user.lastName,
            timezone: profileData.user.timezone || 'America/New_York',
            role,
            avatarUrl: profile?.avatar,
            teacherStatus: profile?.status,
            teacherStatusUpdate: profile?.statusUpdatedAt,
            isSuperTutor: profile ? isSuperTutor(profile.superTutorTo) : false,
            createdAt: profileData.user.createdAt,
        };

        console.log('Fetched user profile from API:', profileData);

        // Guardar en caché
        this.cache.save(user);
        console.log('💾 User saved to cache');

        return user;
    }

    clearCache(): void {
        this.cache.clear();
    }
}