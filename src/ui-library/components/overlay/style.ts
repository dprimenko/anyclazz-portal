import { styled } from 'styled-components';

export const OverlayContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 100dvw;
    height: 100dvh;
    background-color: rgba(41, 44, 50, 0.7);
    z-index: ${({ theme }) => theme.zIndex[10]};
`;