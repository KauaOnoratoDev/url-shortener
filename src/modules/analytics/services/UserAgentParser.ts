import { UserAgentInfo } from '@modules/analytics/DTOs';

export interface UserAgentParser {
    parse(userAgent?: string): Promise<UserAgentInfo>;
}
