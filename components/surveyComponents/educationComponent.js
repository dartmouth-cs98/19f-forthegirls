import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import TextField from 'react-native-text-field';


class EducationComponent extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      highSchool: '',
      college: '',
      gradYear: '',
      currentJob: '',
    }
  }

  highSchoolInput = (text) => {
    this.setState({ highSchool: text });
  }

  collegeInput = (text) => {
    this.setState({ college: text });
  }

  gradYearInput = (text) => {
    this.setState({ gradYear: text });
  }

  currentJobInput = (text) => {
    this.setState({ currentJob: text });
  }



  checkState = () => {
    console.log(this.state);
  }


  submitPage = () => {
    var eduInfo = {
      'highSchool': this.state.highSchool,
      'college': this.state.college,
      'gradYear': this.state.gradYear,
      'currentJob': this.state.currentJob,
    }
    var basicInfo = this.props.navigation.getParam("basicInfo",  null);
    var demoInfo = this.props.navigation.getParam("demoInfo",  null);
    var csInfo = this.props.navigation.getParam("csInfo",  null);


    if(this.state.highSchool === '' || this.state.college === '' || this.state.gradYear === '' || this.state.currentJob === '') {
      Alert.alert(
        'Please Fill Out All Fields to Continue',
        '',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK'},
        ],
        { cancelable: true }
      );
    }
    else {
      this.props.navigation.navigate('Header', {pastPage: "eduInfo",  basicInfo: basicInfo, demoInfo: demoInfo, csInfo: csInfo, eduInfo: eduInfo});
    }

  }

  render() {
    const year = (new Date()).getFullYear();
    const years = Array.from(new Array(20),( val, index) => index + year);
    const data = {value: years}

    return (
      <View style={{marginTop: 100}}>
        <Text> Let's learn a little more about your education and job experience! </Text>
      
        <TextField
          title="High School"
          placeholder="High School"
          onInputChange={this.highSchoolInput}
          clearButtonMode='while-editing'
          keyboardType='default'
        />
        <TextField
          title="College"
          placeholder="College"
          onInputChange={this.collegeInput}
          clearButtonMode='while-editing'
          keyboardType='default'
        />
        <TextField
          title="Grad Year"
          placeholder="Graduation Year"
          onInputChange={this.gradYearInput}
          clearButtonMode='while-editing'
          keyboardType='default'
        />
        <TextField
          title="Current Job"
          placeholder="Current or Most Recent Job or Internship"
          onInputChange={this.currentJobInput}
          clearButtonMode='while-editing'
          keyboardType='default'
        />
        <Button
          title="Next"
          input={this.state}
          onPress={this.submitPage}
          />
      </View>
    );
  }
}

export default EducationComponent;
