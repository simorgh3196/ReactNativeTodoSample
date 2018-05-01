import React from 'react'
import { StyleSheet, Text, View, ListView, AlertIOS } from 'react-native'
import StatusBar from './components/StatusBar'
import ActionButton from './components/ActionButton'
import ListItem from './components/ListItem'
import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBUvRRvqx7f10JEe-3JshfC8xKnuES4Qbc",
    authDomain: "todo-2b260.firebaseapp.com",
    databaseURL: "https://todo-2b260.firebaseio.com",
    projectId: "todo-2b260",
    storageBucket: "todo-2b260.appspot.com",
    messagingSenderId: "642773369851"
}
const firebaseApp = firebase.initializeApp(firebaseConfig)

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
    this.itemsRef = firebase.database().ref()
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snapshot) => {
      let items = []
      snapshot.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key,
        })
      })

      this.setState({
        database: this.state.dataSource.cloneWithRows(items)
      })
    })
  }

  _renderItem = (item) => {
    const CompleteTask = () => {
      AlertIOS.prompt(
        'Complete',
        null,
        [
          {text: '完了', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'キャンセル', onPress: (text) => console.log('Cancel')},
        ],
        'default'
      )
    }
    return (
      <ListItem item={item} onPress={CompleteTask} />
    )
  }

  _addItem = () => { 
    AlertIOS.prompt(
      '新規作成',
      null,
      [
        {
          text: '作成する',
          onPress: (text) => {
            this.itemsRef.push({ title: text })
          }
        },
      ],
      'plain-text'
    )
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef)
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar title="TODO List" />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem}
          enableEmptySections={true}
          style={styles.listView}
          />
         <ActionButton title="新規作成" onPress={this._addItem} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listView: {
    flex: 1,
  }
})
