import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';
import type {
    GetUserProfileParams,
    UpdateUserParams,
    ChangePasswordParams,
    UserProfile,
    UserRepository,
    MyProfileResponse,
} from '../domain/types';

export class ApiUserRepository implements UserRepository {
    private readonly httpClient: FetchClient;

    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }

    async getUserProfile({ token }: GetUserProfileParams): Promise<UserProfile> {
        const response = await this.httpClient.get({
            url: '/profile/me',
            token,
        });
        const data: MyProfileResponse = await response.json();
        return {
            id: data.user.id,
            name: data.user.firstName,
            surname: data.user.lastName,
            email: data.user.email,
            avatar: data.user.avatar,
            timezone: data.user.timezone,
            country: data.user.country,
            city: data.user.city,
            bio: data.user.bio,
        };
    }

    async updateUser({ token, data }: UpdateUserParams): Promise<void> {
        const headers: HeadersInit = { Authorization: `Bearer ${token}` };

        let body: BodyInit;

        if (data.avatar instanceof File) {
            const form = new FormData();
            form.append('avatar', data.avatar);
            if (data.email !== undefined) form.append('email', data.email);
            if (data.name !== undefined) form.append('name', data.name);
            if (data.surname !== undefined) form.append('surname', data.surname);
            if (data.timezone) form.append('timezone', data.timezone);
            if (data.bio != null) form.append('bio', data.bio);
            if (data.address) form.append('address', JSON.stringify(data.address));
            // No añadir Content-Type: el browser lo genera con el boundary
            body = form;
        } else {
            headers['Content-Type'] = 'application/json';
            const jsonBody: Record<string, unknown> = {
                ...(data.email !== undefined ? { email: data.email } : {}),
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.surname !== undefined ? { surname: data.surname } : {}),
                ...(data.timezone !== undefined ? { timezone: data.timezone } : {}),
                ...(data.bio !== undefined ? { bio: data.bio } : {}),
                ...(data.address ? { address: data.address } : {}),
            };
            body = JSON.stringify(jsonBody);
        }

        const response = await fetch(`${getApiUrl()}/profile/me`, {
            method: 'POST',
            headers,
            body,
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            if (response.status === 409) {
                throw new Error('EMAIL_ALREADY_IN_USE');
            }
            throw new Error(errorBody.error ?? `Update failed: ${response.status}`);
        }
    }

    async changePassword({ token, data }: ChangePasswordParams): Promise<void> {
        const response = await fetch(`${getApiUrl()}/profile/me/password`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            if (response.status === 401 && (errorBody as { error?: string }).error === 'Current password is incorrect') {
                throw new Error('WRONG_CURRENT_PASSWORD');
            }
            throw new Error((errorBody as { error?: string }).error ?? `Change password failed: ${response.status}`);
        }
    }
}
