import { styled } from 'styled-components';
import { Overlay } from '../overlay/Overlay';
import { typography } from '../../themes/resources/typography';
import { screens } from '../../themes/resources/breakpoints';

export const ModalOverlay = styled(Overlay)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacings[16]};

    @media ${screens.screenGTS} {
        justify-content: center;
    }
`;

export const ModalContainer = styled.div<{ $width: number }>`
    background-color: ${({ theme }) => theme.colors.basic.white};
    border-radius: ${({ theme }) => theme.radii[8]};
    padding: ${({ theme }) => theme.spacings[24]};
    display: flex;
    flex-direction: column;

    width: ${({ $width }) => $width ? `${$width}px` : '100%'};
`;

export const ModalHeader = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ModalHeaderTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.colors.neutral[900]};
`;

export const ModalHeaderSubtitle = styled.div`
    ${({ theme }) => typography(theme, 'body', 'regular')};
    color: ${({ theme }) => theme.colors.neutral[600]};
`;

export const ModalCloseButton = styled.div`
    cursor: pointer;
`;

export const ModalTitle = styled.h3`
    ${({ theme }) => typography(theme, 'display3', 'semibold')};
`;

export const ModalContent = styled.div``;

export const ModalActions = styled.div`
    margin-top: ${({ theme }) => theme.spacings[32]};
    display: flex;
    justify-content: space-between;
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spacings[16]};
    width: 100%;

    @media ${screens.screenGTS} {
		flex-direction: row;
    }
`;