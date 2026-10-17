import RingLoader from 'react-spinners/RingLoader';

import { Overlay2, Card } from '@blueprintjs/core';

type Props = {
    small?: boolean;
};

const Loading = ({ small }: Props) => {
    if (small) return <RingLoader size={30} />;
    return <RingLoader size={120} />;
};

export const LoadingOverlay = () => {
    return (
        <Overlay2
            autoFocus
            enforceFocus
            onClose={() => {
                /* Clear state */
            }}
            isOpen={true}
        >
            <div className="v-center">
                <Card interactive={true} elevation={1} className="h-center">
                    <Loading />
                </Card>
            </div>
        </Overlay2>
    );
};

export default Loading;
