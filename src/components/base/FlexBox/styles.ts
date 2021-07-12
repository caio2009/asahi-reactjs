import styled from 'styled-components';

type FlexBoxContainerProps = {
  direction?: 'row' | 'column';
  items?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  content?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  flexGrow?: number;
}

export const FlexBoxContainer = styled.div<FlexBoxContainerProps>`
  display: flex;
  flex-direction: ${props => props.direction ? props.direction : 'row'};
  align-items: ${props => props.items ? props.items : 'center'};
  justify-content: ${props => props.content ? props.content : 'center'};
  flex-grow: ${props => props.flexGrow ? props.flexGrow : 0};
`; 