import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import {
  arrayOf,
  shape,
  string,
} from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    'overflow-y': 'auto',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

function AddToCanvasBody({
  files,
}) {
  const classes = useStyles();

  const onImageDragStart = useCallback(({
    currentTarget,
    dataTransfer,
  }) => {
    dataTransfer.setData('document/type', 'image');
    dataTransfer.setData('image/url', currentTarget.src);
    dataTransfer.dropEffect = 'move';
  }, []);

  const onPdfDragStart = useCallback(({ dataTransfer }, index) => {
    dataTransfer.setData('document/type', 'pdf');
    dataTransfer.setData('document/index', index);
    dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <GridList cellHeight={180} className={classes.gridList}>
      {files.map(({
        type,
        url,
        urls,
      }, index) => {
        switch (type) {
          case'image':
            return (
              <GridListTile key={url} cols={2}>
                <img
                  src={url}
                  alt={url}
                  style={{
                    cursor: 'move',
                  }}
                  draggable
                  onDragStart={onImageDragStart}
                />
                <GridListTileBar title="Image" />
              </GridListTile>
            );
          case'pdf':
            return (
              <GridListTile key={urls[0]} cols={2}>
                <img
                  src={urls[0]}
                  alt={urls[0]}
                  style={{
                    cursor: 'move',
                  }}
                  draggable
                  onDragStart={(event) => onPdfDragStart(event, index)}
                />
                <GridListTileBar title="PDF" />
              </GridListTile>
            );
          default:
            return null;
        }
      })}
    </GridList>
  );
}

function mapStateToProps(state) {
  const {
    canvas: {
      files,
    },
  } = state;

  return {
    files,
  };
}

AddToCanvasBody.defaultProps = {
  files: [],
};

AddToCanvasBody.propTypes = {
  files: arrayOf(
    shape({
      img: string.isRequired,
      title: string.isRequired,
    }),
  ),
};

export default connect(mapStateToProps)(AddToCanvasBody);
