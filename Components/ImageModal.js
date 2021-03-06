import React, { Component } from 'react';
import { Text, View, Button, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import colors, { buttons, fonts, fontEffects, modal } from '../assets/styles/basicStyle';
import modalStyle from '../assets/styles/modalStyle';

//help from https://facebook.github.io/react-native/docs/0.52/modal

class ImageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    }
  }

  closeModal = () => {
    this.setState({ visible: false });
    this.props.reset();
  }


  render() {
    return (
      <Modal
        visible={this.state.visible}
        animationType={'none'}
        transparent={false}
        onRequestClose={() => this.closeModal()}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0
        }}
      >
        <View style={modalStyle.imgModalContainer}>
          <Image style={{ resizeMode: 'contain', height: '80%', width: '100%' }} source={this.props.image} />
          <TouchableOpacity
            onPress={() => this.closeModal()}>
            <View style={[buttons.logInOutButton, modal.closeButton]}><Text style={[fonts.minorHeading, colors.white]}>Cool Pic!</Text></View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

}

export default ImageModal;