import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import SignIn from '../Components/Signin';
import SignUp from '../Components/Signup';
import MainTabBar from '../navigation/MainTabBar';
import StartScreen from '../Components/StartScreen';
import BasicSignUpComponent from '../Components/basicSignUpComponent';
import Profile from '../Components/Profile';



// console.log(Main);

const SignInUp = createStackNavigator(
  {
    Start: {
      screen: StartScreen,
    },
    SignIn: {
      screen: SignIn,
    },
    SignUp: {
      screen: SignUp,
    },
    Main: {
      screen: MainTabBar,
    },
    BasicInfo: {
      screen: BasicSignUpComponent,
    },
    Profile: {
      screen: Profile,
    }
  },
  {
    initialRouteName: 'Start',
    headerMode: 'none',
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // this is from https://stackoverflow.com/questions/52307978/how-to-disable-react-navigations-stack-navigator-transition
      },
    }),
  },
);

const SignInUpStack = createAppContainer(SignInUp);

export default SignInUpStack;
