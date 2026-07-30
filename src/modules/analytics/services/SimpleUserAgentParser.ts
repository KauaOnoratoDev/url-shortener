import { DeviceType, UserAgentInfo } from '@modules/analytics/DTOs';
import { UserAgentParser } from '@modules/analytics/services/UserAgentParser';

export class SimpleUserAgentParser implements UserAgentParser {
    async parse(userAgent?: string): Promise<UserAgentInfo> {
        const value = userAgent?.slice(0, 1024) ?? '';

        return {
            browser: this.detectBrowser(value),
            operatingSystem: this.detectOperatingSystem(value),
            deviceType: this.detectDeviceType(value),
        };
    }

    private detectBrowser(userAgent: string): string {
        if (/SamsungBrowser/i.test(userAgent)) return 'Samsung Internet';
        if (/(Edg|EdgA|EdgiOS)\//i.test(userAgent)) return 'Edge';
        if (/(OPR|Opera)\//i.test(userAgent)) return 'Opera';
        if (/(FxiOS|Firefox)\//i.test(userAgent)) return 'Firefox';
        if (/(CriOS|Chrome|Chromium)\//i.test(userAgent)) return 'Chrome';
        if (/Safari\//i.test(userAgent) && /Version\//i.test(userAgent)) {
            return 'Safari';
        }
        if (/(MSIE|Trident)\//i.test(userAgent)) return 'Internet Explorer';

        return 'Unknown';
    }

    private detectOperatingSystem(userAgent: string): string {
        if (/Windows NT/i.test(userAgent)) return 'Windows';
        if (/(iPad|CPU OS)/i.test(userAgent)) return 'iPadOS';
        if (/(iPhone|iPod)/i.test(userAgent)) return 'iOS';
        if (/Android/i.test(userAgent)) return 'Android';
        if (/CrOS/i.test(userAgent)) return 'Chrome OS';
        if (/Mac OS X/i.test(userAgent)) return 'macOS';
        if (/Linux/i.test(userAgent)) return 'Linux';

        return 'Unknown';
    }

    private detectDeviceType(userAgent: string): DeviceType {
        if (!userAgent) return 'unknown';

        if (/(iPad|Tablet|Kindle|Silk|PlayBook)/i.test(userAgent)) {
            return 'tablet';
        }

        if (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) {
            return 'tablet';
        }

        if (/(Mobile|iPhone|iPod|IEMobile|Windows Phone)/i.test(userAgent)) {
            return 'mobile';
        }

        return 'desktop';
    }
}
