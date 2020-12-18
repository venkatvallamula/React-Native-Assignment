import React, { Component } from 'react';
import { StackNavigator ,createAppContainer} from 'react-navigation';
import {createStackNavigator } from 'react-navigation-stack';
//  Screens
import UserPosts from './app/components/UserPosts';
import PostComment from './app/components/PostComment';
import DeletePost from './app/components/DeletePost';



const NavStack = createStackNavigator(
  {
    UserPosts: { screen: UserPosts },
    PostComment: { screen: PostComment },
    DeletePost: { screen: DeletePost },
  },
  {
    initialRouteName: 'UserPosts',
  }
);
const App = createAppContainer(NavStack);
export default App;
