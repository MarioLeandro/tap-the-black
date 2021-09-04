import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableHighlight } from 'react-native';
import Tap from './src/components/Tap';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

export default function App() {
  const[screen, setScreen] = useState('menu');
  const[points, setPoints] = useState(0);
  const[timer, setTimer] = useState(60);
  const[board, setBoard] = useState([]);
  const[isActive, setIsActive] = useState(false);
  const[hasFinished, setHasFinished] = useState(false);
  const[randomNumbers] = useState([2]);
  const[lastPontuation, setLastPontuation] = useState(0);
  const [sound, setSound] = useState<Sound  | null>();

  async function playSoundCorrect() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('./assets/correct.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); 
  }

  async function playSoundWrong() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('./assets/wrong.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); 
  }



  function getRandomInt(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    if (isActive && timer > 0) {
        setTimeout(() => {
            setTimer(timer - 1);
        }, 1000)
    } else if (isActive && timer == 0) {
        setLastPontuation(points);
        setHasFinished(true);
        setIsActive(false);
        setScreen('gameover');
        setPoints(0);
    }
}, [isActive, timer])

useEffect(() => {
  console.log(hasFinished, isActive, timer)
}, [isActive])

  function startGame() {
    setIsActive(true);
    setHasFinished(false);
    setTimer(60)
    randomNumbers[0] = getRandomInt(0, 15);

    let random = getRandomInt(0, 15);

    while (random == randomNumbers[0]) {
      random = getRandomInt(0, 15);
    }

    randomNumbers[1] = random;

    while (random == randomNumbers[1] || random == randomNumbers[0]) {
      random = getRandomInt(0, 15);
    }

    randomNumbers[2] = random;
    
    setScreen('game');
  }

  function makePoint(index:number) {
    setPoints(points + 1);
    playSoundCorrect();
    for (let i = 0; i < randomNumbers.length; i++) {
      if(randomNumbers[i] == index) {
        let random = getRandomInt(0, 15);

        do {
          random = getRandomInt(0, 15);
        } while (random === randomNumbers[0] || random === randomNumbers[1] || random === randomNumbers[2]);
         
        if(random != randomNumbers[0] || random != randomNumbers[1] || random != randomNumbers[2]) {
          randomNumbers[i] = random;
        }
        

      }
      
    }
  }

  function gameOver() {
    playSoundWrong();
    setHasFinished(true);
    setIsActive(false);
    setLastPontuation(points);
    setTimer(60)
    setScreen('gameover');
    setPoints(0);
    console.log(hasFinished);
  }

  return(
    <>
      {screen === 'menu' ? (
        <View style={styles.containerMenu}> 
          <Image
          source={require('./assets/logo.png')}
        />

        <TouchableHighlight
          style={styles.btnStart}
          onPress={startGame}
          underlayColor='gray'>
            <Text style={styles.txtStart}>START</Text>
        </TouchableHighlight>
        </View>) : (
          <>
          {hasFinished ? ( 
          <View style={styles.containerGameOver}>
            <Text style={styles.txtMenu}>{lastPontuation}</Text>
            <Text style={styles.txtMenu}>GAME OVER</Text>
            <TouchableHighlight
            style={styles.btnGameOver}
            onPress={() => setScreen('menu')}
            underlayColor='gray'>
              <Text style={styles.txtMenuBtn}>Menu</Text>
          </TouchableHighlight>
          </View>) : (
            <View style={styles.container}> 

          <View style={styles.header}>
            <Text style={styles.txtGame}>{points}</Text>
            <Text style={styles.txtGame}>{timer}</Text>
          </View>  

          <View style={styles.board}>
            {Array.from({length: 16}).map((_, index) => (
              <Tap key={index} index={index} makePoint={() => makePoint(index)} randomNumbers={randomNumbers} gameOver={gameOver}/>
            ))}
          </View>         

        </View>
          )}
          </>
        
      )
      
      }
    </>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
  },

  containerGameOver: {
    flex: 1,
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems:'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
  },

  board: {
    backgroundColor: 'black',
    height: '48%',
    width: '95%',
    justifyContent: 'center',
    alignItems:'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    marginTop: 150,
  },

  header: {
    flex: 0.5,
    backgroundColor: 'black',
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingHorizontal: 10, 
    marginTop: 15,
  },

  containerMenu: {
    flex: 1,
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
  },

  btnStart: {
    backgroundColor: 'black',
    height: 50,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth:1,
  },

  txtStart: {
    color: 'white',
    fontWeight: 'bold',
  },

  txtGame: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
    marginTop: 50,
  },
  
  btnMenu: {
    backgroundColor: 'black',
    height: 50,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth:1,
  },

  txtMenu: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 50,
    marginBottom: 20,
  },

  txtMenuBtn: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },

  btnGameOver: {
    backgroundColor: 'black',
    height: 50,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth:1,
  },
});
