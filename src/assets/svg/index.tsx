import Svg, { Path, SvgProps } from 'react-native-svg';

export const ChatIcon = ({ color, style, ...props }: SvgProps) => (
    <Svg
        stroke={color}
        fill={color}
        stroke-width='0'
        viewBox='0 0 512 512'
        style={[
            {
                width: 24,
                height: 24,
            },
            Array.isArray(style) ? [...style] : style,
        ]}
        {...props}
    >
        <Path d='M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z'></Path>
    </Svg>
);

export const MeIcon = ({ color, style, ...props }: SvgProps) => (
    <Svg
        stroke={color}
        fill={color}
        viewBox='0 0 24 24'
        stroke-width='1.5'
        style={[
            {
                width: 24,
                height: 24,
            },
            Array.isArray(style) ? [...style] : style,
        ]}
        {...props}
    >
        <Path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
        />
    </Svg>
);
