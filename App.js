import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Constants, ImagePicker, Permissions } from 'expo';
import uploadPhoto from './Utils';
import Fire from "./Fire";
const base64 = require('base-64');
import axios from "axios";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      image: null,
      uploading: false,
      imageInfo: ""
    };
  }

  render() {


    let {
      image,
      imageInfo
    } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />

        <Text
          style={styles.titleText}>
          Welcome to AEye
        </Text>
        <Text
          style={styles.subtitleText}>
          Note: this is a quick, self-diagnosis tool, but is not medically approved and if you have any concerns regarding your health, please talk to your doctor immediately
        </Text>

        <Button
          onPress={this._pickImage}
          title="Pick an image from your gallery"
        />
        <View style={{ marginTop: 15, marginBottom: 15 }}>
          <Button onPress={this._takePhoto} title="Take a photo" />
        </View>
        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}
        {this.state.imageInfo.length > 0 ?
          <View>
            <Text
              style={styles.subText}>
              Here are the skin diseases we think you might have and their associated confidence levels:
          </Text>
            <Text
              style={styles.infoText}>
              {this.state.imageInfo}
            </Text>
          </View>
          : <View />
        }
      </View>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
          <View style={{ transform: [{ translateY: 150 }] }}>
            <ActivityIndicator color="#fff" size="large" />
          </View>
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let {
      image
    } = this.state;

    if (!image) {
      return;
    }

    return (
      <View
        style={styles.maybeRenderContainer}>
        <View
          style={styles.maybeRenderImageContainer}>
          <Image source={{ uri: image }} style={styles.maybeRenderImage} />
        </View>

        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={styles.maybeRenderImageText}>
          {image}
        </Text>
      </View>
    );
  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.image,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert('Copied image URL to clipboard');
  };

  _takePhoto = async () => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  _handleImagePicked = async pickerResult => {
    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true
      });

      if (!pickerResult.cancelled) {
        let firebaseImageUrl = await uploadImageAsync(pickerResult.uri);
        let apikey = "NI127iWt-nSPDUZQ9y-6ShvLldGfLRrlCXXFLId3yhZ_";
        let baseUrl = "https://gateway.watsonplatform.net/visual-recognition/api/v3/classify";
        let clasifid = "DefaultCustomModel_917421811";
        let version = '2018-03-19';
        // let apikey = 
        let finalUrl = `${baseUrl}?url=${firebaseImageUrl}&classifier_ids=${clasifid}&version=${version}`;
        console.log("finalUrl", finalUrl);

        // request(options, function (error, response, body) {
        //   if (error) throw new Error(error);
        //   Fire.shared.firebaseUpload(firebaseImageUrl);
        //   alert("analysis" + JSON.stringify(response));
        //   // console.log(body);
        // });
        // var form = new FormData();
        // form.append("apikey", "NI127iWt-nSPDUZQ9y-6ShvLldGfLRrlCXXFLId3yhZ");
        // var headers = new Headers();
        // let headers = new Headers({ "Authorization": 'Basic '+$base64.encode("apikey:" + "NI127iWt-nSPDUZQ9y-6ShvLldGfLRrlCXXFLId3yhZ_")' });
        // headers.append('Authorization', 'Basic ' + base64.encode("apikey:" + "NI127iWt-nSPDUZQ9y-6ShvLldGfLRrlCXXFLId3yhZ_"));
        // var formData = new FormData();
        // formData.append("apikey", "NI127iWt-nSPDUZQ9y-6ShvLldGfLRrlCXXFLId3yhZ_");
        // formz.append("apikey", "NI127iWt-nSPDUZQ9y-6ShvLlsdGfLRrlCXXFLId3yhZ_");
        // headers.append("Authorization", 'Basic ' + btoas("apikey:" + "NI127iWt-nSPDUZQ9y-6ShvLldGfLRrlCXXFLId3yhZ_"));
        // headers.append("Content-Type", "application/x-www-form-urlencoded");
        // fetch(finalUrl, {
        //   method: "POST",
        //   headers: headers,
        //   withCredentials: true
        // }).then(function (response) {
        //   alert("analysis" + JSON.stringify(response));
        //   Fire.shared.firebaseUpload(firebaseImageUrl);
        // }).catch(function (error) {
        //   alert("this sucks error ", error);
        // });

        axios.post(finalUrl, {}, {
          withCredentials: true,
          auth: {
            username: "apikey",
            password: apikey
          }
        })
          .then(response => {
            console.log("response!!!!!!!");
            console.log(JSON.stringify(response));
            console.log("analysis" + JSON.stringify(response.data.images[1].classifiers[0]));
            if (response.status === 200) {
              let allinfo = response.data.images[1].classifiers[0].classes;
              Fire.shared.firebaseUpload(firebaseImageUrl);

              const capCase = (phrase) => {
                return phrase
                  .toLowerCase()
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
              };

              var displayInfo = "";
              for (let details of allinfo) {
                let score = (details["score"] * 100).toFixed(2);
                let classname = details["class"];
                if (classname === "nevus.zip") {
                  classname = "Benign (nothing harmful)";
                }
                else if (classname === "normal_skin.zip") {
                  classname = "Normal (no disease)";
                }
                else {
                  classname = capCase(classname);
                }
                displayInfo = displayInfo + classname + ": " + score + "%\n";
              }
              // imageInfo = displayInfo;
              console.log("final display info:", displayInfo);
              this.setState({ imageInfo: displayInfo });
            }
            else {
              alert("We ran into an error processing your image. Please try again later!");
            }
          })
        // .catch(function (error) {
        //   if(JSON.stringify(error))
        //   alert("We ran into an error processing your image. Please try again later.", JSON.stringify(error));
        // });
        // }).then(function (res) {
        //   alert("analysis" + JSON.stringify(res));
        // });

        // .then(function (response) {
        //   Fire.shared.firebaseUpload(firebaseImageUrl);
        // })
        // .then(function (myJson) {
        //   console.log(JSON.stringify(myJson));
        // });
        // uploadResult = await uploadResponse.json();

        // this.setState({
        //   image: uploadResult.location
        // });
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({
        uploading: false
      });
    }
  };
}

async function uploadImageAsync(uri) {
  return Fire.shared.post(uri);


  // let apiUrl = 'https://file-upload-example-backend-dkhqoilqqn.now.sh/upload';

  // Note:
  // Uncomment this if you want to experiment with local server
  //
  // if (Constants.isDevice) {
  //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
  // } else {
  //   apiUrl = `http://localhost:3000/upload`
  // }

  // let uriParts = uri.split('.');
  // let fileType = uriParts[uriParts.length - 1];

  // let formData = new FormData();
  // formData.append('photo', {
  //   uri,
  //   name: `photo.${fileType}`,
  //   type: `image/${fileType}`,
  // });

  // let options = {
  //   method: 'POST',
  //   body: formData,
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'multipart/form-data',
  //   },
  // };

  // return fetch(apiUrl, options);
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 32,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: 'center',
  },
  subText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: 'center'
  },
  subtitleText: {
    fontSize: 16,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: 'center',
    color: "red"
  },
  infoText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: 'center',
    color: "blue"
  },
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingVertical: 15
  },
  maybeRenderContainer: {
    borderRadius: 3,
    elevation: 2,
    marginTop: 30,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowRadius: 5,
    width: 250,
  },
  maybeRenderImageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: 'hidden',
  },
  maybeRenderImage: {
    height: 250,
    width: 250,
  },
  maybeRenderImageText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  }
});