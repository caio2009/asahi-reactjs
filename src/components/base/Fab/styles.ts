import styled from 'styled-components';

interface FabContainerProps {
  bottom?: number;
} 

export const FabContainer = styled.div<FabContainerProps>`
  position: fixed;
  right: 8px;
  bottom: ${props => props.bottom ? props.bottom : 8}px;
`;