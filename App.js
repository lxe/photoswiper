import React, { Component } from 'react';

import {
  Text,
  View,
  Image,

  CameraRoll
} from 'react-native';

import SwipeCards from 'react-native-swipe-cards';

function getMorePhotos(page) {
  return new Promise((resolve, reject) => {
    CameraRoll.getPhotos({
      first: 30,
      after: page ? page : undefined,
      assetType: 'All'
    }).then(r => {
      resolve({
        media: r.edges
          .map((e, index) => e.node.image && e.node.image.uri)
          .filter(Boolean)
          .map(uri => ({
            uri: uri
          })),
        pagination: r.page_info
      });
    }).catch(e => reject(e))
  });
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      media: []
    };
  }

  componentWillMount() {
    getMorePhotos().then(p => this.setState(p));
  }

  handleYup (card) {
    card.uri = '';
  }

  handleNope (card) {
    card.uri = '';
  }

  render() {
    if (this.state.media.length === 0) {
      return <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
      }}><Text style={{
        color: 'white',
        fontSize: 24
      }}>Loading...</Text>
      </View>
    }

    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black'
      }}>
        <SwipeCards
          style={{
            flex: 1,
          }}
          yupStyle={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            marginLeft: -64,
            borderRadius: null,
            borderWidth: null,
            borderColor: null
          }}
          yupTextStyle={{
            fontSize: 128
          }}
          yupText='✅'
          nopeStyle={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            // marginRight: 64,
            borderRadius: null,
            borderWidth: null,
            borderColor: null
          }}
          nopeTextStyle={{
            fontSize: 128
          }}
          nopeText='🗑️'
          onClickHandler={()=>{}}
          cards={this.state.media}
          renderCard={(d) => (
            <View style={{
              width: 380,
              height: null,
              flex: 1
            }}>
              <Image
                resizeMode="contain"
                source={{ uri: d.uri }}
                style={{
                  width: null,
                  height: null,
                  flex: 1
                }} />
            </View>
          )}
          cardRemoved={(index) => {
            console.log(index, this.state.media.length)
            if (this.state.media.length - index <= 10) {
              getMorePhotos(this.state.pagination.end_cursor).then(r => {
                this.setState({ 
                  media: this.state.media.concat(r.media),
                  pagination: r.pagination
                });

                console.log(this.state)
              });
            }
          }}
        />
      </View>
    )
  }
}
