import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight} from 'react-native';

interface TapProps {
  index: number;
  makePoint: ()=>void;
  gameOver: ()=>void;
  randomNumbers: number[];
}

export default function Tap({index, makePoint, randomNumbers, gameOver}:TapProps) {

    return (
        <>
        {index === randomNumbers[0] || index === randomNumbers[1] || index === randomNumbers[2] ? (
          <TouchableHighlight
            style={styles.tapBlack}
            onPress={makePoint}
            underlayColor='white'>
              <Text></Text>
          </TouchableHighlight>
        ):(
          <TouchableHighlight
            style={styles.tapWhite}
            onPress={gameOver}
            underlayColor='red'>
              <Text></Text>
          </TouchableHighlight>
        )}
        </>
      )}    

const styles = StyleSheet.create({
  
    tapWhite: {
      backgroundColor: 'white',
      height: '25%',
      width: '25%',
      borderColor: 'black',
      borderWidth:1,
    },

    tapBlack: {
      backgroundColor: 'black',
      height: '25%',
      width: '25%',
      borderWidth:1,
    },

  });