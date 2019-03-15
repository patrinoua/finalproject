import React from 'react'
import {connect} from 'react-redux'
import axios from '../../axios'
import {deletePin} from '../../actions'
import {updatePinInfo} from '../../actions'
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react'
import {Container, BlackVail, XIcon} from '../../elements.js'
import {
  PinClickFieldsContainer,
  PinTitle,
  PinTitleText,
  PinClickRow,
  PinClickSecondRow,
} from './elements.js'
class PinClick extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: null,
      lng: null,
      holder: null,
      ready: null,
      removeButtonText: 'X',
      editMode: false,
      title: '',
      url: '',
      deleteAlertIsVisible: false
    }
    this.setFile = this.setFile.bind(this)
    this.compileData = this.compileData.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.insertPinInfo = this.insertPinInfo.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.deletePinAlert = this.deletePinAlert.bind(this)
    this.togglePinClick = this.togglePinClick.bind(this)
    this.exportPin = this.exportPin.bind(this)
  }
  togglePinClick() {
    this.props.togglePinClick()
  }
  componentDidMount() {
    axios
      .post('/PinClick', {
        pinId:
          this.props.pinId ||
          window.atob(this.props.match.params.encryptedPinId)
      })
      .then(response => {
        // console.log("response.data.pinInfo in pinClick", response.data.pinInfo);
        this.setState({
          title: response.data.pinInfo.title,
          category: response.data.pinInfo.category,
          color: response.data.pinInfo.color,
          url:
            response.data.pinInfo.url ||
            response.data.pinInfo.color ||
            '/pins/greyPin.png',
          description: response.data.pinInfo.description,
          created_at: response.data.pinInfo.created_at,
          userId: response.data.pinInfo.user_id,
          lat: response.data.pinInfo.lat,
          lng: response.data.pinInfo.lng,
          ready: true
        })
      })
      .catch(err => {
        console.log(`error in PinClick componentDidMount: ${err}`)
      })
  }
  toggleEditMode(e) {
    if (!this.state.editMode) {
      this.setState({
        editMode: true
      })
    } else {
      this.setState({
        editMode: false
      })
    }
  }
  setFile(e) {
    this.setState({
      file: e.target.files[0]
    })
  }
  handleChange(e) {
    this[e.target.name] = e.target.value
  }
  checkValue(e) {
    this.category = e.target.name
    this.setState({
      holder: e.target.name
    })
  }
  insertPinInfo(e) {
    let pinInfo = {
      description: this.description,
      title: this.title,
      pinId: this.props.pinId
    }
    const formData = new FormData()
    formData.append('file', this.state.file)
    if (this.state.file) {
      this.props.dispatch(updatePinInfo({formData, pinInfo}))
      this.toggleEditMode()
    } else {
      this.props.dispatch(updatePinInfo({pinInfo}))
      this.toggleEditMode()
    }
  }
  compileData(e) {
    this.setState(
      {
        file: e.target.files[0]
      },
      () => {
        try {
          let selectedImg = new FileReader()
          selectedImg.readAsDataURL(this.state.file)
          selectedImg.addEventListener('load', () => {
            this.setState({dataUrl: selectedImg.result})
          })
        } catch (err) {
          console.log(`error in compileData: ${err}`)
        }
      }
    )
  }
  deletePinAlert() {
    this.setState({
      deleteAlertIsVisible: true
    })
    if (this.state.deleteAlertIsVisible === true) {
      this.props.dispatch(deletePin(this.props.pinId))
      this.setState({
        deleteAlertIsVisible: false
      })
      this.togglePinClick()
    }
    // onClick={this.toggleEditMode}
  }
  exportPin() {
    const encryptedPinId = window.btoa(this.props.pinId)
    // const pinUrl = `localhost:8080/sharedpin/${encryptedPinId}`;
    const pinUrl = `https://pinapp-spiced.herokuapp.com/sharedpin/${encryptedPinId}`
    this.setState({
      pinUrl
    })
    //copy to clipboard:
    var dummy = document.createElement('textarea')
    document.body.appendChild(dummy)
    dummy.value = pinUrl
    dummy.select()
    document.execCommand('copy')
    document.body.removeChild(dummy)
  }
  render() {
    if (!this.state.ready && !this.props.markersArray.length > 0) {
      return <div>not ready</div>
    } else {

      const shareButtons = () => {
        return (
          <div className="colPinClick">
            <button
              className="pinAppButton"
              onClick={() => {
                this.exportPin()
              }}
            >
              Copy Link
            </button>
            {this.state.pinUrl && (
              <div className="copyUrlVail">
                <div
                  className="closeCopyUrlVail"
                  onClick={() => {
                    this.setState({
                      pinUrl: false
                    })
                  }}
                >
                  {' '}
                  X
                </div>
                <div className="copyUrl" id="copyUrl">
                  {this.state.pinUrl} link copied to clipboard
                </div>
              </div>
            )}
          </div>
        )
      }

      const deleteAlert = () => {
        return (
          <div className="blackVailDelete">
            Are you sure you want to delete this pin?
            <div className="inARow">
              <button
                onClick={() => {
                  this.deletePinAlert()
                }}
              >
                yes
              </button>
              <button
                onClick={() => {
                  this.setState({
                    deleteAlertIsVisible: false
                  })
                }}
              >
                no
              </button>
            </div>
          </div>
        )
      }

      let currentPinInfo = []

      if (this.props.pinId) {
        currentPinInfo = this.props.markersArray.filter(item => {
          return item.id === this.props.pinId
        })
      } else if (this.props.flag) {
        currentPinInfo.push({
          title: this.state.title,
          url: this.state.url,
          lat: this.state.lat,
          lng: this.state.lng,
          category: this.state.category,
          color: this.state.color
        })
      } else {
        currentPinInfo = [this.state]
      }

      let imageUrl
      if (currentPinInfo[0].url || currentPinInfo[0].color) {
        imageUrl = currentPinInfo[0].url || currentPinInfo[0].color
      } else {
        imageUrl = '/pins/greyPin.png'
      }

      const edit = () => {
        if (this.state.userId === this.props.id) {
          return (
            <div className="pinEditSaveButtonArea box">
              <h1 className="saveButton" onClick={this.toggleEditMode}>
                {' '}
                edit{' '}
              </h1>
            </div>
          )
        } else {
          return <div />
        }
      }

      let bigPin
      if (currentPinInfo[0]) {
        bigPin = currentPinInfo[0].color || '/pins/bigPin.png'
      } else {
        bigPin = '/pins/bigPin.png'
      }

      return (
        <React.Fragment>
          <Container>
            <BlackVail onClick={this.togglePinClick} />
            <PinClickFieldsContainer>
              <XIcon onClick={this.togglePinClick}>
                X
              </XIcon>
              <PinTitle>
                <img src={bigPin} />
                <PinTitleText>
                  {currentPinInfo[0].title || 'clicked pin!'}
                </PinTitleText>
              </PinTitle>
              <PinClickSecondRow>
                <div className="boxPinClick">
                  <Map
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                    center={{
                      lat: this.props.lat || this.state.lat || 52.4918854,
                      lng:
                        this.props.lng || this.state.lng || 13.360088699999999
                    }}
                    zoom={14}
                    google={this.props.google}
                    onReady={this.fetchPlaces}
                    visible={true}
                  >
                    {this.props.markersArray &&
                      currentPinInfo.map(item => {
                        return (
                          <Marker
                            key={item.id}
                            onClick={this.pinClick}
                            name={item.id}
                            position={{
                              lat: item.lat,
                              lng: item.lng
                            }}
                            icon={{
                              url: item.color,
                              anchor: new google.maps.Point(15, 35),
                              scaledSize: new google.maps.Size(25, 35)
                            }}
                          />
                        )
                      })}
                  </Map>
                  {/* <img src="/map.png" /> */}
                </div>
                <div className="boxPinClick">
                  {(this.state.editMode && (
                    <div className="galleryItemsContainer">
                      <input
                        id="inputfile"
                        className="inputfile"
                        type="file"
                        name="file"
                        onChange={(e) => {
                          this.setFile(e)
                          this.compileData(e)
                        }}
                        data-multiple-caption="{count} files selected"
                        multiple
                      />
                      <label htmlFor="inputfile">
                        {(this.state.dataUrl && (
                          <img
                            src={this.state.dataUrl}
                            className="uploadedImagePinclick"
                            alt="uploadedImagePinclick"
                          />
                        )) || (
                          <div className="cameraIconContainerPinClick">
                            <img
                              alt="cameraIcon"
                              src="/pins/camera.png"
                              className="cameraIcon"
                            />
                          </div>
                        )}
                      </label>
                    </div>
                  )) || (
                    <div
                      className="galleryItemsContainer"
                      style={{
                        backgroundImage: `url(${imageUrl})`
                      }}
                    />
                  )}
                </div>
              </PinClickSecondRow>
              {/* *******************THIRD ROW**********************/}
              {(this.state.editMode && (
                <PinClickRow>
                  <div className="colPinClick">
                    <div className="textFieldsPinClick">
                      <textarea
                        placeholder={currentPinInfo[0].title || 'Title'}
                        className="titleTextareaPinClick"
                        type="text"
                        name="title"
                        rows="1"
                        onChange={this.handleChange}
                      />
                      <textarea
                        placeholder={
                          currentPinInfo[0].description || 'Description'
                        }
                        className="descriptionTextareaPinClick"
                        type="text"
                        name="description"
                        onChange={this.handleChange}
                        rows="1"
                      />
                    </div>
                    <button
                      className="subtleButton"
                      onClick={this.deletePinAlert}
                    >
                      Unpin
                    </button>
                  </div>
                  {shareButtons()}
                </PinClickRow>
              )) || (
                <PinClickRow>
                  <div className="colPinClick ">
                    <div>{currentPinInfo[0].title || 'Title'}</div>
                    <div>{currentPinInfo[0].description || 'Description'}</div>
                  </div>
                  {shareButtons()}
                </PinClickRow>
              )}
              {/* *************************FOURTH ROW********************* */}
              {this.state.editMode && (
                <div className="pinEditSaveButtonArea box">
                  <div className="saveButton" onClick={this.insertPinInfo}>
                    Save
                  </div>
                  <div className="saveButton" onClick={this.toggleEditMode}>
                    Cancel
                  </div>
                  {this.state.deleteAlertIsVisible && deleteAlert()}
                </div>
              )}{' '}
              {!this.state.editMode && edit()}
            </PinClickFieldsContainer>
          </Container>
        </React.Fragment>
      )
    }
  }
}
const mapStateToProps = function(state) {
  return {
    markersArray: state.markersArray,
    pinInfo: state.pinInfo,
    userName: state.userName
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAM59_tOly6RmV6eSBYguDKRMukEgQ20d4'
})(connect(mapStateToProps)(PinClick))