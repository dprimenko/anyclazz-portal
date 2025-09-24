import { styled } from 'styled-components';
import { Overlay } from '../overlay/Overlay';

export const DrawerOverlay = styled(Overlay)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export const DrawerContainer = styled.div<{ $width: number }>`
    position: relative;
    background-color: ${({ theme }) => theme.colors.basic.white};
    height: 100dvh;
    width: ${({ $width }) => `${$width}%`};
`;

export const DrawerClose = styled.div`
    position: absolute;
    top: ${({ theme }) => theme.spacings[16]};
    right: ${({ theme }) => theme.spacings[16]};
    cursor: pointer;
    z-index: ${({ theme }) => theme.zIndex[1]};
`;