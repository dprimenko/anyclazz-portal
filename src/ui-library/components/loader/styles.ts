import styled from "styled-components";

export const Loader = styled.div<{ $color: string, $backgroundColor: string }>`
    width: 80px;
    aspect-ratio: 1;
    border: 10px solid ${({ $backgroundColor }) => $backgroundColor};
    box-sizing: border-box;
    background: 
      radial-gradient(farthest-side,${({ $color }) => $color} 98%,${({ $backgroundColor }) => $backgroundColor}) 0    0/20px 20px,
      radial-gradient(farthest-side,${({ $color }) => $color} 98%,${({ $backgroundColor }) => $backgroundColor}) 100% 0/20px 20px,
      radial-gradient(farthest-side,${({ $color }) => $color} 98%,${({ $backgroundColor }) => $backgroundColor}) 100% 100%/20px 20px,
      radial-gradient(farthest-side,${({ $color }) => $color} 98%,${({ $backgroundColor }) => $backgroundColor}) 0 100%/20px 20px,
      linear-gradient(${({ $color }) => $color} 0 0) 50%/40px 40px,
      ${({ $backgroundColor }) => $backgroundColor};
    background-repeat:no-repeat;
    filter: blur(4px) contrast(10);
    animation: l12 0.8s infinite;

    @keyframes l12 {
        100%  {background-position:100% 0,100% 100%,0 100%,0 0,center}
    }
`;