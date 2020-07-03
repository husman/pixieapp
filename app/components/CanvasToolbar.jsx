import React, { useCallback } from 'react';
import {
  func,
  string,
} from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Tools } from 'react-sketch';
import SelectIcon from './icons/Select.svg';
import DrawIcon from './icons/Draw.svg';
import CircleIcon from './icons/Circle.svg';
import TextIcon from './icons/Text.svg';
import AttachmentIcon from './icons/Attachment.svg';
import { setCanvasTool } from '../actions/canvas';

const StyledRelativeContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const StyledContainer = styled.div`
  position: absolute;
  left: 10px;
  top: 20px;
  background-color: #EBF0F6;
  border-radius: 2px;
  padding: 0 10px 10px;
  text-align: center;
  box-shadow: 0 0 3px #ccc;
`;

const IconLabel = styled.div`
  font-size: 0.75em;
  color: #${({ isActive }) => isActive ? '3D9970' : '2D2D2D'};
  margin: 5px 0;
`;

const IconWrapper = styled.div`
  margin-top: 10px;
  cursor: pointer;

  :hover {
    svg {
      stroke: #087829;
    }
    div {
      color: #087829;
    }
  }
`;

const IconContainer = styled(IconWrapper)`
  border-bottom: 1px solid #BFD4ED;
  cursor: pointer;

  :hover {
    svg {
      stroke: #087829;
    }
    div {
      color: #087829;
    }
  }
`;

function getColor(isActive) {
  return isActive ? '#3D9970' : '#2D2D2D';
}

function CanvasToolbar({
  dropzone,
  tool,
  updateCanvasTool,
}) {
  const onToolChanged = useCallback(({
    currentTarget: {
      dataset,
    },
  }) => {
    updateCanvasTool(dataset.tool);
  }, [updateCanvasTool]);

  const onOpenFileDialog = useCallback(() => {
    if (dropzone) {
      dropzone.hiddenFileInput.click();
    }
  }, [dropzone]);

  return (
    <StyledRelativeContainer>
      <StyledContainer>
        <IconContainer
          onClick={onToolChanged}
          data-tool={Tools.Select}
        >
          <SelectIcon
            width="20"
            stroke={getColor(tool === Tools.Select)}
          />
          <IconLabel
            isActive={tool === Tools.Select}
          >
            Select
          </IconLabel>
        </IconContainer>
        <IconContainer
          onClick={onToolChanged}
          data-tool={Tools.Pencil}
        >
          <DrawIcon
            width="20"
            stroke={getColor(tool === Tools.Pencil)}
          />
          <IconLabel
            isActive={tool === Tools.Pencil}
          >
            Draw
          </IconLabel>
        </IconContainer>
        {/*<IconContainer*/}
        {/*  onClick={onToolChanged}*/}
        {/*  data-tool={Tools.Circle}*/}
        {/*>*/}
        {/*  <CircleIcon*/}
        {/*    width="20"*/}
        {/*    stroke={getColor(tool === Tools.Circle)}*/}
        {/*  />*/}
        {/*  <IconLabel*/}
        {/*    isActive={tool === Tools.Circle}*/}
        {/*  >*/}
        {/*    Shape*/}
        {/*  </IconLabel>*/}
        {/*</IconContainer>*/}
        <IconContainer
          onClick={onToolChanged}
          data-tool={Tools.Text}
        >
          <TextIcon
            width="20"
            stroke={getColor(tool === Tools.Text)}
          />
          <IconLabel
            isActive={tool === Tools.Text}
          >
            Text
          </IconLabel>
        </IconContainer>
        <IconWrapper onClick={onOpenFileDialog}>
          <AttachmentIcon />
          <IconLabel>
            Attach
          </IconLabel>
        </IconWrapper>
      </StyledContainer>
    </StyledRelativeContainer>
  );
}

CanvasToolbar.propTypes = {
  tool: Tools.Pencil,
};

CanvasToolbar.propTypes = {
  tool: string,
  updateCanvasTool: func.isRequired,
};

function mapStateToProps(state) {
  const {
    canvas: {
      dropzone,
      tool,
    },
  } = state;
  return {
    dropzone,
    tool,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateCanvasTool: tool => dispatch(setCanvasTool(tool)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasToolbar);
