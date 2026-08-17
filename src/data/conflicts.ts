/**
 * Scheme pairs that are redundant/overlapping enough that recommending both
 * as top picks is poor advice (e.g. two alternative pension tracks for the
 * same unorganized-worker target group). Fed to the quantum optimizer as
 * soft conflicts so it can trade one off against the other rather than
 * surfacing both.
 */
export const SCHEME_CONFLICTS: [string, string][] = [['apy', 'pmsym']]
