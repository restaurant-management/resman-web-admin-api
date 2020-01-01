import { StylesConfig } from 'react-select';

export const selectStyle: StylesConfig = {
    control: (base, state) => ({
        ...base,
        backgroundColor: 'transparent',
        borderWidth: 0,
        height: 32,
        minHeight: 32
    }),
    container: (base, state) => ({
        ...base,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 5,
        height: 32
    }),
    indicatorsContainer: (base, state) => ({
        ...base,
        height: 32
    }),
    menu: (base, state) => ({
        ...base,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 5
    }),
    multiValue: (base, state) => ({
        ...base,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 5
    }),
    multiValueLabel: (base, state) => ({
        ...base,
        color: 'white'
    }),
    singleValue: (base, state) => ({
        ...base,
        color: 'white'
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: 'transparent'
    })
};
