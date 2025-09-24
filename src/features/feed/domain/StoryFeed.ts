import type { Address } from '../../shared/address/domain/Address'
import { Tag } from '../../user/domain/Tag';
import type { User } from '../../user/domain/user';

export interface StoryFeed {
    id: string;
    title?: string;
    description?: string;
    tags: Tag[];
    url: URL;
    address?: Address;
    user?: User;
    likes: number;
}
