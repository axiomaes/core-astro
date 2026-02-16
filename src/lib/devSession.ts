import type { SessionData } from './session';

export function getDevSession(): SessionData {
    return {
        user: {
            id: 'dev-admin',
            userName: 'dev_admin',
            isAdmin: true,
            teams: ['Dev Team']
        },
        acl: {},
        aclFetchedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        espoToken: undefined,
        espoCookie: undefined
    };
}
