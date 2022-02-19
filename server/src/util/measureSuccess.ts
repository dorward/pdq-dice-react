type Props = {
    high?: boolean;
    roll: number;
};

const measureSuccess = ({ high, roll }: Props) => {
    if (typeof high === 'undefined') return;
    if (high && roll >= 4) return true;
    if (!high && roll <= 3) return true;
    return false;
};

export default measureSuccess;
