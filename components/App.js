/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React from 'react';
import {
  connect,
} from 'react-redux';
import Video from './Video';
import Audio from './Audio';
import {
  getCaptureSourceId,
  getScreenSize,
} from '../utils/capture';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/latex';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import Win from '../utils/window';
import {
  Library,
  Inspector,
  Runtime,
} from '@observablehq/runtime'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PencilIcon from '@material-ui/icons/Create';
import TextIcon from '@material-ui/icons/Title';
import uuid from 'uuid';
import Canvas from './Canvas';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CodeIcon from '@material-ui/icons/Code';
import GestureIcon from '@material-ui/icons/Gesture';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import classNames from 'classnames';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles';
import {
  setCanvasTool,
} from 'actions/canvas';
import {
  Tools,
} from 'react-sketch';
import SocketClient from 'lib/SocketClient';
import PointerIcon from 'mdi-material-ui/CursorDefaultOutline';

const SOCKET_EVENT_ICE_CANDIDATE = 'ice-candidate';
const SOCKET_EVENT_USER_JOINED = 'user-joined';
const SOCKET_EVENT_USER_LEAVE = 'user-leave';
const SOCKET_EVENT_ICE_OFFER = 'ice-offer';

/**
 * Event dispatched when a new entry is added to the notebook.
 *
 * @type {String}
 */
const PEER_NOTEBOOK_ADD_ENTRY = 'notebook:entry:add';

/**
 * Event dispatched when a notebook entry changes.
 *
 * @type {String}
 */
const PEER_NOTEBOOK_ENTRY_CHANGE = 'notebook:entry:change';

/**
 * Entry type for HTML content.
 *
 * @type {string}
 */
const NOTEBOOK_ENTRY_TYPE_HTML = 'html';

/**
 * Entry type for JavaScript content.
 *
 * @type {string}
 */
const NOTEBOOK_ENTRY_TYPE_JAVASCRIPT = 'javascript';

/**
 * Entry type for Latex content.
 *
 * @type {string}
 */
const NOTEBOOK_ENTRY_TYPE_LATEX = 'latex';

const SUPPORTED_NOTEBOOK_TYPES = new Set([
  NOTEBOOK_ENTRY_TYPE_HTML,
  NOTEBOOK_ENTRY_TYPE_JAVASCRIPT,
  NOTEBOOK_ENTRY_TYPE_LATEX,
]);

/**
 * The maximum number of remote videos we would like to display at once.
 *
 * @type {Number}
 */
const MAX_NB_REMOTE_VIDEOS_TO_DISPLAY = 5;

const drawerWidth = 240;

const theme2 = createMuiTheme({
  palette: {
    type: 'dark',
  },
  typography: {
    useNextVariants: true,
  },
});

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#424242',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    const {
      mediaDevices,
    } = navigator;
    const constraints = {
      video: true,
      audio: false,
    };
    const {
      width: windowWidth,
      height: windowHeight,
    } = Win.getPrimaryWindowSize();
    const codeEditorLibrary = new Library();

    this.state = {
      constraints,
      localStream: null,
      remoteStreams: [],
      connections: {},
      isAddSubMenuOpened: false,
      isAnnotating: false,
      codeEditorValue: '',
      windowWidth,
      windowHeight,
      notebook: [],
      codeEditorLibrary,
      runtime: new Runtime(codeEditorLibrary),
      notebookAnnotation: null,
      isCanvasActive: true,
      isNotebookActive: false,
    };

    this.initWindowEvents();

    mediaDevices
        .getUserMedia(constraints)
        .then(this.onLocalStreamSuccess);
  }


  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  /**
   * Handler for the component's rendering
   *
   * @returns {*} - HTML
   */
  render() {
    const {
      localStream,
      remoteStreams,
      notebook,
      isAddSubMenuOpened,
      isCanvasActive,
      isNotebookActive,
    } = this.state;
    const nbMaxRemoteVideosToDisplay = this.getMaxNbRemoteVideosToDisplay();
    const {
      classes,
      theme,
      tool,
    } = this.props;

    return (
        <MuiThemeProvider theme={theme2}>
          <div className="app-container">
            <CssBaseline/>
            <AppBar
                position="fixed"
                className={classNames(classes.appBar, {
                  [classes.appBarShift]: this.state.open,
                })}
            >
              <Toolbar disableGutters={!this.state.open}>
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={this.handleDrawerOpen}
                    className={classNames(classes.menuButton, {
                      [classes.hide]: this.state.open,
                    })}
                >
                  <MenuIcon/>
                </IconButton>
                <Typography variant="h6" color="inherit" noWrap>
                  <span className="logo-text">NEETOS</span>
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={classNames(classes.drawer, {
                  [classes.drawerOpen]: this.state.open,
                  [classes.drawerClose]: !this.state.open,
                })}
                classes={{
                  paper: classNames({
                    [classes.drawerOpen]: this.state.open,
                    [classes.drawerClose]: !this.state.open,
                  }),
                }}
                open={this.state.open}
            >
              <div className={classes.toolbar}>
                <IconButton onClick={this.handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                </IconButton>
              </div>
              <Divider/>
              <List
                  className="app-sidemenu"
                  component="nav"
              >
                {!isCanvasActive ?
                    <ListItem
                        button
                        className={`${isCanvasActive && 'active'}`}
                        onClick={this.showCanvas}
                    >
                      <ListItemIcon>
                        <GestureIcon/>
                      </ListItemIcon>
                      <ListItemText primary="Canvas"/>
                    </ListItem>
                    : null
                }
                {!isNotebookActive ?
                    <ListItem
                        button
                        className={`${isNotebookActive && 'active'}`}
                        onClick={this.showNotebook}
                    >
                      <ListItemIcon>
                        <CodeIcon/>
                      </ListItemIcon>
                      <ListItemText primary="Notebook"/>
                    </ListItem>
                    : null
                }
                {isCanvasActive ?
                    <React.Fragment>
                      <ListItem
                          button
                          className={`${tool === Tools.Select && 'active'}`}
                          onClick={this.onChangeCanvasToolToPointer}
                      >
                        <ListItemIcon>
                          <PointerIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Pointer"/>
                      </ListItem>
                      <ListItem
                          button
                          className={`${tool === Tools.Pencil && 'active'}`}
                          onClick={this.onChangeCanvasToolToPencil}
                      >
                        <ListItemIcon>
                          <PencilIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Draw"/>
                      </ListItem>
                      <Divider/>
                      <ListItem
                          button
                          className={`${tool === Tools.Text && 'active'}`}
                          onClick={this.onChangeCanvasToolToText}
                      >
                        <ListItemIcon>
                          <TextIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Text"/>
                      </ListItem>
                    </React.Fragment>
                    : null
                }
                {isNotebookActive ?
                    <ListItem
                        button
                        onClick={this.onAddNotebookEntry}
                        className="create-note-btn"
                    >
                      <ListItemIcon>
                        <NoteAddIcon/>
                      </ListItemIcon>
                      <ListItemText primary="Create Note"/>
                    </ListItem>
                    :
                    null
                }
                <Divider/>
              </List>
            </Drawer>
            <div className="app-content">
              <div className="code-editor-container">
                {isNotebookActive ?
                    <div className="notebook-container">
                      {notebook.map((notebookEntry, index) => {
                        const evaluatedClassName = notebookEntry.value ? 'code-editor--evaluated' : '';

                        return (
                            <div key={index} className={`code-editor ${evaluatedClassName}`}>
                              <div className="code-editor-wrapper">
                                <AceEditor
                                    wrapEnabled={true}
                                    mode={notebookEntry.type}
                                    theme="monokai"
                                    onChange={this.onNotebookEntryChange(notebookEntry.id, notebookEntry.remote)}
                                    name="pixie-editor"
                                    debounceChangePeriod={1000}
                                    focus
                                    editorProps={{
                                      $blockScrolling: Infinity,
                                    }}
                                    value={notebookEntry.value}
                                    setOptions={{
                                      enableBasicAutocompletion: true,
                                      enableLiveAutocompletion: true,
                                      showPrintMargin: false,
                                      highlightActiveLine: false,
                                      showLineNumbers: false,
                                      showGutter: false,
                                      maxLines: Infinity,
                                    }}
                                    style={{
                                      width: '100%',
                                      backgroundColor: '#272822',
                                    }}
                                />
                              </div>
                              <div className="code-editor__render">
                                <span ref={this.onNotebookEntryInit(notebookEntry)}/>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                    :
                    null
                }
                {isCanvasActive ?
                    <Canvas/>
                    :
                    null
                }
              </div>

              <div className="user-videos-container">
                {localStream ?
                    <Video
                        autoPlay
                        className="user-video"
                        onInit={this.onLocalVideoInit}
                    />
                    :
                    null
                }
                {remoteStreams.map((remoteStream, index) =>
                    index >= nbMaxRemoteVideosToDisplay ?
                        <Audio
                            autoPlay
                            key={remoteStream.clientId}
                            onInit={this.onRemoteAudioInit(remoteStream)}
                        />
                        :
                        <Video
                            autoPlay
                            className="user-video"
                            key={remoteStream.clientId}
                            onInit={this.onRemoteVideoInit(remoteStream)}
                        />
                )}
              </div>
            </div>
          </div>
          {isAddSubMenuOpened ?
              <div
                  className="create-note-submenu"
                  ref={this.initNotebookActionSubmenu}
              >
                <List
                    component="nav"
                    className="create-note-submenu__list"
                    dense
                >
                  <ListItem
                      button
                      onClick={this.onAddEntry(NOTEBOOK_ENTRY_TYPE_HTML)}
                  >
                    <ListItemText primary="HTML"/>
                  </ListItem>
                  <ListItem
                      button
                      onClick={this.onAddEntry(NOTEBOOK_ENTRY_TYPE_JAVASCRIPT)}
                  >
                    <ListItemText primary="JavaScript"/>
                  </ListItem>
                  <ListItem
                      button
                      onClick={this.onAddEntry(NOTEBOOK_ENTRY_TYPE_LATEX)}
                  >
                    <ListItemText primary="LaTex"/>
                  </ListItem>
                </List>
              </div>
              :
              null
          }
        </MuiThemeProvider>
    );
  }

  initCanvas = (canvas) => {
    if (!canvas) {
      return;
    }

    this._canvas = canvas._fc;
  };

  /**
   * Handler for canvas tool change to the text tool.
   */
  onChangeCanvasToolToText = () => {
    this.props.updateCanvasTool(Tools.Text);
  };

  /**
   * Handler for canvas tool change to the pencil tool.
   */
  onChangeCanvasToolToPencil = () => {
    this.props.updateCanvasTool(Tools.Pencil);
  };

  /**
   * Handler for canvas tool change to the pointer tool.
   */
  onChangeCanvasToolToPointer = () => {
    this.props.updateCanvasTool(Tools.Select);
  };

  /**
   * Displays the canvas
   */
  showCanvas = () => {
    this.setState({
      isCanvasActive: true,
      isNotebookActive: false,
    });
  };

  /**
   * Displays the Notebook
   */
  showNotebook = () => {
    this.setState({
      isCanvasActive: false,
      isNotebookActive: true,
    });
  };

  initNotebookActionSubmenu = (elem) => {
    if (!elem) {
      return;
    }

    const anchorElem = document.querySelector('.create-note-btn');
    const anchorBoundingRect = anchorElem.getBoundingClientRect();
    elem.style.top = `${anchorBoundingRect.top}px`;
  };

  /**
   * Event handler for when a new notebook entry is being added.
   */
  onAddNotebookEntry = () => {
    this.setState({
      isAddSubMenuOpened: !this.state.isAddSubMenuOpened,
    });
  };

  /**
   * Event handler for when a new HTML notebook entry is being added.
   *
   * @param {String} entryType - The notebook entry type.
   */
  onAddEntry = (entryType) => {
    return () => {
      const newEntry = {
        id: uuid.v4(),
        type: entryType,
        value: '',
      };

      SocketClient.emit(PEER_NOTEBOOK_ADD_ENTRY, newEntry);

      this.setState({
        isAddSubMenuOpened: false,
        notebook: [
          ...this.state.notebook,
          newEntry,
        ],
      });
    };
  };

  /**
   * Returns the parameters for the HTML VM.
   *
   * @param {String} htmlCode - The input 'HTML' code.
   *
   * @returns {[]}
   */
  getHTMLVM = (htmlCode) => {
    return [
      // List of inputs to the HTML VM.
      [
        'html',
      ],

      // The definition to execute the HTML code.
      // @param {Function} html - Observable 'html' standard library.
      // @returns {*} - HTML code to render.
      (html) => html`${htmlCode}`,
    ];
  };

  /**
   * Returns the parameters for the JavaScript VM.
   *
   * @param {String} jsCode - The input 'JavaScript' code.
   *
   * @returns {[]}
   */
  getJavaScriptVM = (jsCode) => {
    const definition = eval(`() => {${jsCode}}`);

    return [
      // List of inputs to the JavaScript VM.
      [],

      // The definition to execute the JavaScript code.
      // @param {Function} JavaScript executor.
      // @returns {*} - returns the output of JavaScript code.
      definition,
    ];
  };

  /**
   * Returns the parameters for the LaTex VM.
   *
   * @param {String} latexCode - The input 'LaTex' code.
   *
   * @returns {[]}
   */
  getLatexVM = (latexCode) => {
    return [
      // List of inputs to the LaTex VM.
      [
        'tex',
      ],

      // The definition to execute the LaTex code.
      // @param {Function} html - Observable 'tex' standard library.
      // @returns {*} - returns the output of LaTex code.
      (tex) => tex`${latexCode}`,
    ];
  };

  /**
   * Returns the Observable Virtual Machine parameters for the given notebook entry type and value.
   *
   * @param {String} type - The notebook entry type.
   * @param {*} value - The notebook entry value.
   *
   * @returns {{inputs, definition}} - Observable Virtual Machine params.
   */
  getEntryTypeVMParams = (type, value) => {
    switch (type) {
      case NOTEBOOK_ENTRY_TYPE_HTML:
        return this.getHTMLVM(value);
      case NOTEBOOK_ENTRY_TYPE_JAVASCRIPT:
        return this.getJavaScriptVM(value);
      case NOTEBOOK_ENTRY_TYPE_LATEX:
        return this.getLatexVM(value);
      default:
        throw new Error(`No virtual machine found for type "${type}"`);
    }
  };

  /**
   * Handler to execute/render the notebook entry.
   *
   * @param {{}} notebookEntry - The notebook entry.
   * @returns {Function} - The event handler callback.
   */
  onNotebookEntryInit = ({ type, value }) => {
    return (elem) => {
      // Do nothing if:
      //  1. The DOM element we're mounting onto is missing.
      //  2. The entry type is not supported.
      //  3. The entry has an empty value.
      if (!elem || !value || !SUPPORTED_NOTEBOOK_TYPES.has(type)) {
        return;
      }

      const {
        runtime,
      } = this.state;
      const notebookVM = runtime.module();
      const inspector = new Inspector(elem);

      try {
        const entryVMParams = this.getEntryTypeVMParams(type, value);
        notebookVM.variable(inspector).define(null, ...entryVMParams);
      } catch (err) {
        elem.innerText = err.message;
      }

    };
  };

  /**
   * Handles new a notebook entry event sent by peers.
   *
   * @param {String} clientId - The ID of the peer who sent the event.
   * @param {{}} notebookEntry - The notebook entry.
   */
  onPeerNotebookEntryAdded = (clientId, notebookEntry) => {
    const {
      notebook,
    } = this.state;

    if (SocketClient.getClientId() !== clientId) {
      this.setState({
        notebook: [
          ...notebook,
          notebookEntry,
        ],
      });
    }
  };

  /**
   * Initializes window event handlers.
   */
  initWindowEvents = () => {
    // 'resize' events can fire at a high rate and should be throttled for optimal performance.
    // See: https://developer.mozilla.org/en-US/docs/Web/Events/resize#Examples
    Win.throttleEvent('resize', 'optimizedResize');
    Win.on('optimizedResize', this.onWindowResized)
  };

  /**
   * Handler for window resize events.
   *
   * @param {Event} evt
   */
  onWindowResized = (evt) => {
    const {
      target: {
        innerWidth: windowWidth,
        innerHeight: windowHeight,
      },
    } = evt;

    this.setState({
      windowWidth,
      windowHeight,
    });
  };

  /**
   * Return the maximum number of remote video streams to display.
   *
   * @returns {Number} - The maximum number of remote video streams to display.
   */
  getMaxNbRemoteVideosToDisplay = () => {
    const {
      windowWidth,
      windowHeight,
    } = this.state;
    const isWindowSizeAvailable = windowWidth > 0 && windowHeight > 0;

    /**
     * Maximum number of remote videos that can fit on the screen.
     * We default to the maximum number of remote videos we would like to display at once.
     *
     * @type {Number}
     */
    let nbRemoteVideosThatCanFitScreen = MAX_NB_REMOTE_VIDEOS_TO_DISPLAY;

    if (isWindowSizeAvailable) {
      /**
       * f(w, h) = 2.5 * w/h
       *
       * Where
       *  w = window width
       *  h = window height
       */
      nbRemoteVideosThatCanFitScreen = Math.floor(2.5 * windowWidth / windowHeight);
    }

    return nbRemoteVideosThatCanFitScreen;
  };

  /**
   * Updates the value of a notebook entry.
   *
   * @param {String} id - The notebook entry ID.
   * @param {*} value - The notebook entry's value.
   */
  updateNotebookEntry = (id, value) => {
    const {
      notebook,
    } = this.state;

    this.setState({
      notebook: notebook.map((cell) => {
        if (cell.id !== id) {
          return cell;
        }

        return {
          ...cell,
          value,
          remote: false,
        };
      })
    });
  };

  /**
   * Handler for content changes within the code editor.
   *
   * @param {String} id - The notebook entry ID.
   * @param {Boolean} isRemoteEvent - True if the change event was due to a change from a remote peer.
   */
  onNotebookEntryChange = (id, isRemoteEvent) => {
    /**
     * @param {*} value - The notebook entry value.
     */
    return (value) => {
      // Do not broadcast messages we received from a remote peer.
      if (!isRemoteEvent) {
        SocketClient.emit(PEER_NOTEBOOK_ENTRY_CHANGE, id, value);
      }

      this.updateNotebookEntry(id, value);
    }
  };

  /**
   * Handler for when a notebook entry change is received from peers.
   *
   * @param {String} clientId - The ID of the peer who sent the changes.
   * @param {String} notebookEntryId - The ID of the entry in the notebook.
   * @param {*} notebookEntryValue - The value of the notebook entry.
   */
  onPeerNotebookEntryChanged = (clientId, notebookEntryId, notebookEntryValue) => {
    const {
      notebook,
    } = this.state;

    if (SocketClient.getClientId() !== clientId) {
      this.setState({
        notebook: notebook.map((notebookEntry) => {
          if (notebookEntry.id !== notebookEntryId) {
            return notebookEntry;
          }

          return {
            ...notebookEntry,
            value: notebookEntryValue,
            remote: true,
          };
        }),
      });
    }
  };

  /**
   *
   * @param {String} senderId - the client ID of the user who just joined.
   * @param {Array} clientIds - a list of all the client IDs in this session.
   * @returns {Promise}
   */
  onUserJoined = async (senderId, clientIds) => {
    const {
      connections,
      localStream,
    } = this.state;
    const newConnections = {};
    const peerConnectionConfig = {
      iceServers: [
        // {
        //   urls: 'stun:turn.neetos.com:3478',
        //   username: 'pixiehd',
        //   credential: 'orc123',
        // },
        // {
        //   urls: 'turn:turn.neetos.com:3478',
        //   username: 'pixiehd',
        //   credential: 'orc123',
        // },
        // {'urls': 'stun:stun.services.mozilla.com'},
        // {'urls': 'stun:stun.l.google.com:19302'},
      ],
    };

    clientIds.forEach(async (clientId) => {
      // Do nothing if the clinet is us or we are already aware of the client
      if (SocketClient.getClientId() === clientId || connections[clientId]) {
        return false;
      }

      // Create a new peer connection for the user that just joined
      newConnections[clientId] = new RTCPeerConnection(peerConnectionConfig);
      newConnections[clientId].onicecandidate = this.onIceCandidate;
      newConnections[clientId].onaddstream = (evt) => this.onAddStream(evt, clientId);

      // Add our local stream to the the connection
      newConnections[clientId].addStream(localStream);
    });

    this.setState({
      connections: {
        ...connections,
        ...newConnections,
      },
    });

    return this.createOfferForNewUser(senderId)
  };

  createOfferForNewUser = async (clientId) => {
    const {
      connections,
    } = this.state;

    if (SocketClient.getClientId() === clientId) {
      return false;
    }

    const connection = connections[clientId];

    try {
      // Create an offer to share media with the new user
      const offerSdp = await connection.createOffer();

      // Set the local descript of the new user's peer connection to the offer we created to share media with hum/her
      await connection.setLocalDescription(offerSdp);

      SocketClient.emit(SOCKET_EVENT_ICE_OFFER, clientId, offerSdp);
    } catch (err) {
      console.error('An error occurred while creating an offer for client with ID:', clientId, err);
    }
  };

  onUserLeave = (clientId) => {
    const {
      connections,
      remoteStreams,
    } = this.state;
    const connection = connections[clientId];

    if (connection) {
      connection.close();
      const newConnections = { ...connection };
      delete newConnections[clientId];

      this.setState({
        connections: newConnections,
        remoteStreams: remoteStreams.filter((stream) => stream.clientId !== clientId),
      });
    }
  };

  onIceCandidate = (evt) => {
    if (evt.candidate) {
      SocketClient.emit(SOCKET_EVENT_ICE_CANDIDATE, evt.candidate);
    }
  };

  /**
   * Dispatched when a remote peer adds a stream.
   *
   * @param {MediaStreamEvent} evt - The event.
   * @param {String} clientId - The ID of the peer whose sending the stream.
   */
  onAddStream = (evt, clientId) => {
    this.setState({
      remoteStreams: [
        ...this.state.remoteStreams,
        {
          clientId,
          stream: evt.stream,
        },
      ],
    });
  };

  /**
   * Dispatched when we have successfully gain access to the user's video/audio device.
   *
   * @param {MediaStream} localStream
   */
  onLocalStreamSuccess = (localStream) => {
    this.setState({
      localStream,
    });

    this.initSocketEvents();
  };

  /**
   * Listens for peer events on the connection to the server.
   */
  initSocketEvents = () => {
    SocketClient.on(SOCKET_EVENT_USER_JOINED, this.onUserJoined);
    SocketClient.on(SOCKET_EVENT_USER_LEAVE, this.onUserLeave);
    SocketClient.on(SOCKET_EVENT_ICE_OFFER, this.onIceOffer);
    SocketClient.on(SOCKET_EVENT_ICE_CANDIDATE, this.onIceCandidateReceived);
    SocketClient.on(PEER_NOTEBOOK_ADD_ENTRY, this.onPeerNotebookEntryAdded);
    SocketClient.on(PEER_NOTEBOOK_ENTRY_CHANGE, this.onPeerNotebookEntryChanged);

    SocketClient.connect();
  };

  onIceOffer = async (clientId, offerSdp) => {
    const {
      connections,
    } = this.state;
    const connection = connections[clientId];

    // Do nothing if no peer connection exist to the client
    if (!connection) {
      return;
    }

    try {
      const sessionDescription = new RTCSessionDescription(offerSdp);
      await connection.setRemoteDescription(sessionDescription);

      if (offerSdp.type === 'offer') {
        const answerSdp = await connection.createAnswer();

        await connection.setLocalDescription(answerSdp);
        SocketClient.emit(SOCKET_EVENT_ICE_OFFER, clientId, answerSdp);
      }

    } catch (err) {
      console.error('Failed to set offer SDP as a remote SDP for client with ID:', clientId, err);
    }
  };

  onIceCandidateReceived = (clientId, candidate) => {
    const {
      connections,
    } = this.state;

    const connection = connections[clientId];

    // Do nothing if there is no connection to the client
    if (!connection) {
      return;
    }

    const iceCandidate = new RTCIceCandidate(candidate);
    connection.addIceCandidate(iceCandidate);
  };

  stopStream = (stream) => {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
  };

  onStopLocalVideo = () => {
    const {
      localStream
    } = this.state;

    if (localStream) {
      this.stopStream(localStream);
    }

    this.setState({
      localStream: null,
    });
  };

  onLocalVideoInit = (video) => {
    const {
      localStream,
    } = this.state;

    if (localStream) {
      video.muted = true;
      video.srcObject = localStream;
    }
  };

  /**
   * Initializes a video element with the stream provided
   *
   * @param {MediaStream} mediaStream
   * @returns {Function} - callback
   */
  onRemoteVideoInit = (mediaStream) => {
    return (video) => {
      if (mediaStream) {
        video.srcObject = mediaStream.stream;
      }
    };
  };

  /**
   * Initializes an audio element with the stream provided
   *
   * @param {MediaStream} mediaStream
   * @returns {Function} - callback
   */
  onRemoteAudioInit = (mediaStream) => {
    return (audio) => {
      if (mediaStream) {
        audio.srcObject = mediaStream.stream;
      }
    };
  };

  /**
   * Initiates screen sharing if it is supported on the current device.
   *
   * @returns {Promise}
   */
  onShareScreen = async () => {
    const screenCaptureSourceId = await getCaptureSourceId();

    if (!screenCaptureSourceId) {
      return;
    }

    const {
      mediaDevices,
    } = navigator;
    const {
      width,
      height,
    } = getScreenSize();
    const constraints = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: screenCaptureSourceId,
          minWidth: width,
          minHeight: height,
          maxWidth: width,
          maxHeight: height
        }
      }
    };

    try {
      const screenShareStream = await mediaDevices.getUserMedia(constraints);
    } catch (err) {
      console.error('Could not get media device to capture the screen', err);
    }
  };
}

/**
 * Called when a new app's state changes
 *
 * @param {{}} state
 *
 * @return {{}} - The props to pass to the components
 */
function mapStateToProps(state) {
  const {
    canvas: {
      tool,
    },
  } = state;

  return {
    tool,
  };
}

/**
 * Provides the initial state props to the component.
 *
 * @param {Function} dispatch - Used to dispatch actions.
 *
 * @return {{}} - The initial props to pass to the component.
 */
function mapDispatchToProps(dispatch) {
  return {
    updateCanvasTool: (tool) => dispatch(setCanvasTool(tool)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(App));
