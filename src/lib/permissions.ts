import type { SessionData } from './session';

export type Action = 'read' | 'create' | 'edit' | 'delete';

export function canEntity(session: SessionData, entityName: string, action: Action): boolean {
    if (session.user.isAdmin) {
        return true;
    }

    const acl = session.acl;
    if (!acl) return false;

    // Support both common shapes in Espo: acl[entity][action] or permissions[entity][action]
    const entityAcl = acl[entityName] || (acl.permissions && acl.permissions[entityName]);

    if (!entityAcl) return false;

    const value = entityAcl[action];

    // In Espo: 'yes', 'all', 'own', 'team', 'no', null etc.
    // We allow if it's explicitly 'yes', 'all', 'own', or 'team'
    // (Note: 'own' and 'team' would require deeper record-level checks, 
    // but for UI/Route level, we allow if not 'no' or null).
    return value !== 'no' && value !== null && value !== undefined && value !== false;
}
