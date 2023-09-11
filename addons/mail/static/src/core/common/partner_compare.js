/* @odoo-module */

import { cleanTerm } from "@mail/utils/common/format";
import { registry } from "@web/core/registry";

/**
 * Registry of functions to sort partner suggestions.
 * The expected value is a function with the following
 * signature:
 *     (partner1: Partner, partner2: Partner, { env: OdooEnv, searchTerm: string, thread?: Thread }) => number|undefined
 */
export const partnerCompareRegistry = registry.category("mail.partner_compare");

partnerCompareRegistry.add(
    "mail.internal-users",
    (p1, p2) => {
        const isAInternalUser = p1.user?.isInternalUser;
        const isBInternalUser = p2.user?.isInternalUser;
        if (isAInternalUser && !isBInternalUser) {
            return -1;
        }
        if (!isAInternalUser && isBInternalUser) {
            return 1;
        }
    },
    { sequence: 10 }
);

partnerCompareRegistry.add(
    "mail.followers",
    (p1, p2, { thread }) => {
        if (thread) {
            const followerList = [...thread.followers];
            const isFollower1 = followerList.some((follower) => follower.partner.eq(p1));
            const isFollower2 = followerList.some((follower) => follower.partner.eq(p2));
            if (isFollower1 && !isFollower2) {
                return -1;
            }
            if (!isFollower1 && isFollower2) {
                return 1;
            }
        }
    },
    { sequence: 20 }
);

partnerCompareRegistry.add(
    "mail.name",
    (p1, p2, { searchTerm }) => {
        const cleanedName1 = cleanTerm(p1.name);
        const cleanedName2 = cleanTerm(p2.name);
        if (cleanedName1.startsWith(searchTerm) && !cleanedName2.startsWith(searchTerm)) {
            return -1;
        }
        if (!cleanedName1.startsWith(searchTerm) && cleanedName2.startsWith(searchTerm)) {
            return 1;
        }
        if (cleanedName1 < cleanedName2) {
            return -1;
        }
        if (cleanedName1 > cleanedName2) {
            return 1;
        }
    },
    { sequence: 25 }
);

partnerCompareRegistry.add(
    "mail.email",
    (p1, p2, { searchTerm }) => {
        const cleanedEmail1 = cleanTerm(p1.email);
        const cleanedEmail2 = cleanTerm(p2.email);
        if (cleanedEmail1.startsWith(searchTerm) && !cleanedEmail1.startsWith(searchTerm)) {
            return -1;
        }
        if (!cleanedEmail2.startsWith(searchTerm) && cleanedEmail2.startsWith(searchTerm)) {
            return 1;
        }
        if (cleanedEmail1 < cleanedEmail2) {
            return -1;
        }
        if (cleanedEmail1 > cleanedEmail2) {
            return 1;
        }
    },
    { sequence: 30 }
);

partnerCompareRegistry.add(
    "mail.id",
    (p1, p2) => {
        return p1.id - p2.id;
    },
    { sequence: 50 }
);
