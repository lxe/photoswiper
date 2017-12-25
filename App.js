import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,

  CameraRoll
} from 'react-native';

import SwipeCards from 'react-native-swipe-cards';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = { media: [] };
  }

  render() {
    console.log(this.props.uri);

    if (!this.props.uri) {
      return <Text>Oops</Text>
    }

    return (
      <View style={{
        alignItems: 'center',
        // borderRadius: 5,
        overflow: 'hidden',
        // borderColor: 'grey',
        // backgroundColor: 'white',
        // borderWidth: 1,
        elevation: 1,
      }}>
        <Image
          resizeMode="contain"
          source={{uri: this.props.uri}}
          style={{
            alignSelf: 'stretch',
            flex: 1,
            width: 300,
            height: undefined
          }} />
      </View>
    )
  }
}

class NoMoreCards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>No more cards</Text>
      </View>
    )
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      media: []
    };
  }

  componentWillMount() {
    CameraRoll.getPhotos({
      first: 30,
      assetType: 'All'
    }).then(r => {
      this.setState({
        media: r.edges
          .map(e => e.node.image && e.node.image.uri)
          .filter(Boolean)
          .map(uri => ({
            uri: uri
          }))
      });
    })
  }

  handleYup(card) {
    console.log(`Yup for ${card.text}`)
  }

  handleNope(card) {
    console.log(`Nope for ${card.text}`)
  }

  handleMaybe(card) {
    console.log(`Maybe for ${card.text}`)
  }

  render() {

    console.log(this.state.media);

    // If you want a stack of cards instead of one-per-one view, activate stack mode
    // stack={true}
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
      }}>
        <SwipeCards
          style={{ flex: 1 }}
          cards={this.state.media}
          renderCard={(cardData) => <Card {...cardData} />}
          renderNoMoreCards={() => <NoMoreCards />}

          handleYup={this.handleYup}
          handleNope={this.handleNope}
          handleMaybe={this.handleMaybe}
          hasMaybeAction
        />
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 48
        }}>
          <Text>Bottom Thing</Text>
        </View>
      </View>
    )
  }
}