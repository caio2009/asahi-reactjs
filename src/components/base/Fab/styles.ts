import styled from 'styled-components';

interface FabContainerProps {
  position?: 'fixed' | 'absolute';
  bottom?: number;
} 

export const FabContainer = styled.div<FabContainerProps>`
  position: ${props => props.position ? props.position : 'fixed'};
  right: 8px;
  bottom: ${props => props.bottom ? props.bottom : 8}px;
`;