import { E_NO_SESSIONS } from '../errors';
// import { Session } from '../types';
import getHighLowStats from './stats/getHighLowStats';
import getSkillChecks from './stats/getSkillChecks';
import getSessions from './getSessions';

const getStatistics = async () => {
    const all_sessions = await getSessions();
    if (all_sessions === E_NO_SESSIONS) {
        return E_NO_SESSIONS;
    }
    const recent = all_sessions[all_sessions?.length - 1];
    // const allTime: Session = {
    //     session_start: all_sessions[0].session_start,
    //     session_end: recent.session_end,
    // };

    const [recentHighLow, /*allTimeHighLow */ recentSkillChecks /*, allTimeSkillChecks */] =
        await Promise.all([
            getHighLowStats(recent),
            // getHighLowStats(allTime),
            getSkillChecks(recent),
            // getSkillChecks(allTime),
        ]);

    return { recentHighLow, recentSkillChecks /* allTimeHighLow, allTimeSkillChecks */ };
};

export default getStatistics;
