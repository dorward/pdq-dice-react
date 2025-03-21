import { HTMLTable } from '@blueprintjs/core';
import { Props } from './types';
import AttributeRow from './attribute-row';

const AttributesPlay = ({ dataSource, title, character, isWoundable = false }: Props) => {
    const attributes = character[dataSource];
    return (
        <>
            <HTMLTable className="attributes">
                <thead>
                    <tr>
                        <th>{title}</th>
                        <th className="health-column">Health</th>
                        <th>
                            MSTR
                            <br />
                            +6
                        </th>
                        <th>
                            EXP
                            <br />
                            +4
                        </th>
                        <th>
                            GD
                            <br />
                            +2
                        </th>
                        <th>
                            AVG
                            <br />
                            +0
                        </th>
                        <th>
                            PR
                            <br />
                            -2
                        </th>
                        <th>
                            GO
                            <br />
                            NE
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {attributes.map((attribute) => (
                        <AttributeRow
                            key={attribute.name}
                            {...{ attribute, character, isWoundable, dataSource }}
                        />
                    ))}
                </tbody>
            </HTMLTable>
        </>
    );
};

export default AttributesPlay;
