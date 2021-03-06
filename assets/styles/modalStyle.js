import { StyleSheet } from 'react-native';
import colors, { fonts } from './basicStyle';

const modalStyle = StyleSheet.create({
  wholeModal: {
    marginTop: 30,
    height: '80%',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    //justifyContent: 'center',
    backgroundColor: colors.veryLightPurple.color
  },

  scroll: {
    width: '100%',
    height: '30%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  hideModal: {
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.deepPurple.color,
    height: 40,
  },

  connectionText: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.deepPurple.color,
    height: 40,
  },

  imgModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //  backgroundColor: colors.black.color,
    marginTop: 50,
    marginBottom: 50,
    borderRadius: 20
  }
})

export default modalStyle;
