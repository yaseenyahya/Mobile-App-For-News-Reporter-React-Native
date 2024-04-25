import React, { useState, useEffect } from 'react'
import { Keyboard } from 'react-native'
const KeyboardStatusContext = React.createContext({ keyboardHidden: true,keyboardHeight: 0 })

const KeyboardStatusContextProvider = ({ children }) => {
  const [keyboardHidden, setKeyboardHidden] = useState(true)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  var _keyboardDidShowListener = null
  var _keyboardDidHideListener = null
  const onKeyboardDidShow = (e) => {
    setKeyboardHidden(false)
    setKeyboardHeight(e.endCoordinates.height)
  }
  const onKeyboardDidHide = () => {
    
    setKeyboardHidden(true)
  }
  useEffect(() => {
  
    _keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      onKeyboardDidShow
    )
    _keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      onKeyboardDidHide
    )
    return () => {
 
      _keyboardDidShowListener.remove()
      _keyboardDidHideListener.remove()
    }
  }, [])
  return (
    <KeyboardStatusContext.Provider value={{ keyboardHidden,keyboardHeight }}>
      {children}
    </KeyboardStatusContext.Provider>
  )
}

export { KeyboardStatusContext, KeyboardStatusContextProvider }
