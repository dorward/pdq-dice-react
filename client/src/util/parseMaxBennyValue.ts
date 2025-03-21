export const isDiceFormat = /^\+(\d+)d6/;

export const parseMaxBennyValue = (value: string): [number, string] => {
    const [maxFromState, diceFromState] = `${value || '3'}`.split('+');
    const max = isNaN(+maxFromState) ? 3 : +maxFromState;
    const diceBonus = `+${isDiceFormat.test(diceFromState) ? '0d6' : diceFromState}`;
    return [max, diceBonus];
};
