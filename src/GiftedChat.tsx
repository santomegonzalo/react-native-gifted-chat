import PropTypes from 'prop-types'
import React from 'react'
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  SafeAreaView,
} from 'react-native'

import ActionSheet from '@expo/react-native-action-sheet'
import moment from 'moment'
import uuid from 'uuid'
import { isIphoneX } from 'react-native-iphone-x-helper'

import * as utils from './utils'
import Actions from './Actions'
import Avatar from './Avatar'
import Bubble from './Bubble'
import SystemMessage from './SystemMessage'
import MessageImage from './MessageImage'
import MessageText from './MessageText'
import Composer from './Composer'
import Day from './Day'
import InputToolbar from './InputToolbar'
import LoadEarlier from './LoadEarlier'
import Message from './Message'
import MessageContainer from './MessageContainer'
import Send from './Send'
import Time from './Time'
import GiftedAvatar from './GiftedAvatar'

import {
  MIN_COMPOSER_HEIGHT,
  MAX_COMPOSER_HEIGHT,
  DEFAULT_PLACEHOLDER,
  TIME_FORMAT,
  DATE_FORMAT,
} from './Constant'
import { IMessage, User, Reply } from './types'
import QuickReplies from './QuickReplies'

const GiftedActionSheet = ActionSheet as any

export interface GiftedChatProps<TMessage extends IMessage = IMessage> {
  setCustomRef?: (ref: any) => void
  /* Messages to display */
  messages?: TMessage[]
  /* Input text; default is undefined, but if specified, it will override GiftedChat's internal state */
  text?: string
  /* Controls whether or not the message bubbles appear at the top of the chat */
  alignTop?: boolean;
  /* enables the scrollToBottom Component */
  scrollToBottom?: boolean;
  initialText?: string
  /* Placeholder when text is empty; default is 'Type a message...' */
  placeholder?: string
  /* User sending the messages: { _id, name, avatar } */
  user?: User
  /*  Locale to localize the dates */
  locale?: string
  /* Format to use for rendering times; default is 'LT' */
  timeFormat?: string
  /* Format to use for rendering dates; default is 'll' */
  dateFormat?: string
  /* Animates the view when the keyboard appears */
  isAnimated?: boolean
  /* Enables the "Load earlier messages" button */
  loadEarlier?: boolean
  /*Display an ActivityIndicator when loading earlier messages*/
  isLoadingEarlier?: boolean
  /* Whether to render an avatar for the current user; default is false, only show avatars for other users */
  showUserAvatar?: boolean
  /* When false, avatars will only be displayed when a consecutive message is from the same user on the same day; default is false */
  showAvatarForEveryMessage?: boolean
  /* Render the message avatar at the top of consecutive messages, rather than the bottom; default is false */
  renderAvatarOnTop?: boolean
  inverted?: boolean
  /* Extra props to be passed to the <Image> component created by the default renderMessageImage */
  imageProps?: Message['props']
  /*Extra props to be passed to the MessageImage's Lightbox */
  lightboxProps?: any
  /*Distance of the chat from the bottom of the screen (e.g. useful if you display a tab bar) */
  bottomOffset?: number
  /* Minimum height of the input toolbar; default is 44 */
  minInputToolbarHeight?: number
  /*Extra props to be passed to the messages <ListView>; some props can't be overridden, see the code in MessageContainer.render() for details */
  listViewProps?: any
  /*  Extra props to be passed to the <TextInput> */
  textInputProps?: any
  /*Determines whether the keyboard should stay visible after a tap; see <ScrollView> docs */
  keyboardShouldPersistTaps?: any
  /*Max message composer TextInput length */
  maxInputLength?: number
  /* Force getting keyboard height to fix some display issues */
  forceGetKeyboardHeight?: boolean
  /* Force send button */
  alwaysShowSend?: boolean
  /* Image style */
  imageStyle?: StyleProp<ViewStyle>
  /* This can be used to pass any data which needs to be re-rendered */
  extraData?: any
  /* composer min Height */
  minComposerHeight?: number
  /* composer min Height */
  maxComposerHeight?: number
  options?: { [key: string]: any }
  optionTintColor?: string
  quickReplyStyle?: StyleProp<ViewStyle>
  /* optional prop used to place customView below text, image and video views; default is false */
  isCustomViewBottom?: boolean
  /* Callback when a message avatar is tapped */
  onPressAvatar?(user: User): void
  /* Callback when a message avatar is tapped */
  onLongPressAvatar?(user: User): void
  /* Generate an id for new messages. Defaults to UUID v4, generated by uuid */
  messageIdGenerator?(message?: TMessage): string
  /* Callback when sending a message */
  onSend?(messages: TMessage[]): void
  /*Callback when loading earlier messages*/
  onLoadEarlier?(): void
  /*  Render a loading view when initializing */
  renderLoading?(): React.ReactNode
  /* Custom "Load earlier messages" button */
  renderLoadEarlier?(props: LoadEarlier['props']): React.ReactNode
  /* Custom message avatar; set to null to not render any avatar for the message */
  renderAvatar?(props: Avatar['props']): React.ReactNode
  /* Custom message bubble */
  renderBubble?(props: Bubble['props']): React.ReactNode
  /*Custom system message */
  renderSystemMessage?(props: SystemMessage['props']): React.ReactNode
  /* Callback when a message bubble is long-pressed; default is to show an ActionSheet with "Copy Text" (see example using showActionSheetWithOptions()) */
  onLongPress?(context: any, message: any): void
  /* Reverses display order of messages; default is true */
  /*Custom message container */
  renderMessage?(message: Message['props']): React.ReactNode
  /* Custom message text */
  renderMessageText?(messageText: MessageText['props']): React.ReactNode
  /* Custom message image */
  renderMessageImage?(props: MessageImage['props']): React.ReactNode
  /* Custom view inside the bubble */
  renderCustomView?(props: Bubble['props']): React.ReactNode
  /*Custom day above a message*/
  renderDay?(props: Day['props']): React.ReactNode
  /* Custom time inside a message */
  renderTime?(props: Time['props']): React.ReactNode
  /* Custom footer component on the ListView, e.g. 'User is typing...' */
  renderFooter?(): React.ReactNode
  /* Custom component to render below the MessageContainer (separate from the ListView) */
  renderChatFooter?(): React.ReactNode
  /* Custom message composer container */
  renderInputToolbar?(props: InputToolbar['props']): React.ReactNode
  /*  Custom text input message composer */
  renderComposer?(props: Composer['props']): React.ReactNode
  /* Custom action button on the left of the message composer */
  renderActions?(props: Actions['props']): React.ReactNode
  /* Custom send button; you can pass children to the original Send component quite easily, for example to use a custom icon (example) */
  renderSend?(props: Send['props']): React.ReactNode
  /*Custom second line of actions below the message composer */
  renderAccessory?(props: InputToolbar['props']): React.ReactNode
  /*Callback when the Action button is pressed (if set, the default actionSheet will not be used) */
  onPressActionButton?(): void
  /* Callback when the input text changes */
  onInputTextChanged?(text: string): void
  /* Custom parse patterns for react-native-parsed-text used to linking message content (like URLs and phone numbers) */
  parsePatterns?(): React.ReactNode
  onQuickReply?(replies: Reply[]): void
  renderQuickReplies?(quickReplies: QuickReplies['props']): React.ReactNode
  renderQuickReplySend?(): React.ReactNode
  shouldUpdateMessage?(props: Message['props'], nextProps: Message['props']): boolean
}

export interface GiftedChatState {
  isInitialized: boolean
  composerHeight?: number
  messagesContainerHeight?: number | Animated.Value
  typingDisabled: boolean
  text?: string
}

class GiftedChat<TMessage extends IMessage = IMessage> extends React.Component<
  GiftedChatProps<TMessage>,
  GiftedChatState
> {
  static childContextTypes = {
    actionSheet: PropTypes.func,
    getLocale: PropTypes.func,
  }

  static defaultProps = {
    messages: [],
    text: undefined,
    placeholder: DEFAULT_PLACEHOLDER,
    messageIdGenerator: () => uuid.v4(),
    user: {},
    onSend: () => {},
    locale: null,
    timeFormat: TIME_FORMAT,
    dateFormat: DATE_FORMAT,
    isAnimated: Platform.select({
      ios: true,
      android: false,
    }),
    loadEarlier: false,
    onLoadEarlier: () => {},
    isLoadingEarlier: false,
    renderLoading: null,
    renderLoadEarlier: null,
    renderAvatar: undefined,
    showUserAvatar: false,
    onPressAvatar: null,
    onLongPressAvatar: null,
    renderUsernameOnMessage: false,
    renderAvatarOnTop: false,
    renderBubble: null,
    renderSystemMessage: null,
    onLongPress: null,
    renderMessage: null,
    renderMessageText: null,
    renderMessageImage: null,
    imageProps: {},
    videoProps: {},
    lightboxProps: {},
    textInputProps: {},
    listViewProps: {},
    renderCustomView: null,
    isCustomViewBottom: false,
    renderDay: null,
    renderTime: null,
    renderFooter: null,
    renderChatFooter: null,
    renderInputToolbar: null,
    renderComposer: null,
    renderActions: null,
    renderSend: null,
    renderAccessory: null,
    onPressActionButton: null,
    bottomOffset: 0,
    minInputToolbarHeight: 44,
    keyboardShouldPersistTaps: Platform.select({
      ios: 'never',
      android: 'always',
    }),
    onInputTextChanged: null,
    maxInputLength: null,
    forceGetKeyboardHeight: false,
    inverted: true,
    extraData: null,
    minComposerHeight: MIN_COMPOSER_HEIGHT,
    maxComposerHeight: MAX_COMPOSER_HEIGHT,
  }

  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
    text: PropTypes.string,
    initialText: PropTypes.string,
    placeholder: PropTypes.string,
    messageIdGenerator: PropTypes.func,
    user: PropTypes.object,
    onSend: PropTypes.func,
    locale: PropTypes.string,
    timeFormat: PropTypes.string,
    dateFormat: PropTypes.string,
    isAnimated: PropTypes.bool,
    loadEarlier: PropTypes.bool,
    onLoadEarlier: PropTypes.func,
    isLoadingEarlier: PropTypes.bool,
    renderLoading: PropTypes.func,
    renderLoadEarlier: PropTypes.func,
    renderAvatar: PropTypes.func,
    showUserAvatar: PropTypes.bool,
    onPressAvatar: PropTypes.func,
    onLongPressAvatar: PropTypes.func,
    renderUsernameOnMessage: PropTypes.bool,
    renderAvatarOnTop: PropTypes.bool,
    isCustomViewBottom: PropTypes.bool,
    renderBubble: PropTypes.func,
    renderSystemMessage: PropTypes.func,
    onLongPress: PropTypes.func,
    renderMessage: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderMessageImage: PropTypes.func,
    imageProps: PropTypes.object,
    videoProps: PropTypes.object,
    lightboxProps: PropTypes.object,
    renderCustomView: PropTypes.func,
    renderDay: PropTypes.func,
    renderTime: PropTypes.func,
    renderFooter: PropTypes.func,
    renderChatFooter: PropTypes.func,
    renderInputToolbar: PropTypes.func,
    renderComposer: PropTypes.func,
    renderActions: PropTypes.func,
    renderSend: PropTypes.func,
    renderAccessory: PropTypes.func,
    onPressActionButton: PropTypes.func,
    bottomOffset: PropTypes.number,
    minInputToolbarHeight: PropTypes.number,
    listViewProps: PropTypes.object,
    keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled']),
    onInputTextChanged: PropTypes.func,
    maxInputLength: PropTypes.number,
    forceGetKeyboardHeight: PropTypes.bool,
    inverted: PropTypes.bool,
    textInputProps: PropTypes.object,
    extraData: PropTypes.object,
    minComposerHeight: PropTypes.number,
    maxComposerHeight: PropTypes.number,
    alignTop: PropTypes.bool,
  }

  static append<TMessage extends IMessage>(
    currentMessages: TMessage[] = [],
    messages: TMessage[],
    inverted = true,
  ) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    return inverted
      ? messages.concat(currentMessages)
      : currentMessages.concat(messages)
  }

  static prepend<TMessage extends IMessage>(
    currentMessages: TMessage[] = [],
    messages: TMessage[],
    inverted = true,
  ) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    return inverted
      ? currentMessages.concat(messages)
      : messages.concat(currentMessages)
  }

  _isMounted: boolean = false
  _keyboardHeight: number = 0
  _bottomOffset: number = 0
  _maxHeight?: number = undefined
  _isFirstLayout: boolean = true
  _locale: string = 'en'
  _messages: TMessage[] = []
  invertibleScrollViewProps: any = undefined
  _actionSheetRef: any = undefined

  _messageContainerRef?: any = null;
  textInput?: any

  state = {
    isInitialized: false, // initialization will calculate maxHeight before rendering the chat
    composerHeight: this.props.minComposerHeight,
    messagesContainerHeight: undefined,
    typingDisabled: false,
    text: undefined,
  }

  constructor(props: GiftedChatProps<TMessage>) {
    super(props)

    this.invertibleScrollViewProps = {
      inverted: this.props.inverted,
      keyboardShouldPersistTaps: this.props.keyboardShouldPersistTaps,
      onKeyboardWillShow: this.onKeyboardWillShow,
      onKeyboardWillHide: this.onKeyboardWillHide,
      onKeyboardDidShow: this.onKeyboardDidShow,
      onKeyboardDidHide: this.onKeyboardDidHide,
    }
  }

  getChildContext() {
    return {
      actionSheet: () => this._actionSheetRef,
      getLocale: this.getLocale,
    }
  }

  componentDidMount() {
    const { messages, text } = this.props
    this.setIsMounted(true)
    this.initLocale()
    this.setMessages(messages || [])
    this.setTextFromProp(text)
  }

  componentWillUnmount() {
    this.setIsMounted(false)
  }

  componentDidUpdate(prevProps: GiftedChatProps<TMessage> = {}) {
    if(this.props !== prevProps) {
    const { messages, text } = this.props
    this.setMessages(messages || [])
    this.setTextFromProp(text)
    }
  }

  initLocale() {
    if (
      this.props.locale === null ||
      moment.locales().indexOf(this.props.locale || 'en') === -1
    ) {
      this.setLocale('en')
    } else {
      this.setLocale(this.props.locale || 'en')
    }
  }

  setLocale(locale: string) {
    this._locale = locale
  }

  getLocale = () => this._locale

  setTextFromProp(textProp?: string) {
    // Text prop takes precedence over state.
    if (textProp !== undefined && textProp !== this.state.text) {
      this.setState({ text: textProp })
    }
  }

  getTextFromProp(fallback: string) {
    if (this.props.text === undefined) {
      return fallback
    }
    return this.props.text
  }

  setMessages(messages: TMessage[]) {
    this._messages = messages
  }

  getMessages() {
    return this._messages
  }

  setMaxHeight(height: number) {
    this._maxHeight = height
  }

  getMaxHeight() {
    return this._maxHeight
  }

  setKeyboardHeight(height: number) {
    this._keyboardHeight = height
  }

  getKeyboardHeight() {
    if (Platform.OS === 'android' && !this.props.forceGetKeyboardHeight) {
      // For android: on-screen keyboard resized main container and has own height.
      // @see https://developer.android.com/training/keyboard-input/visibility.html
      // So for calculate the messages container height ignore keyboard height.
      return 0
    }
    return this._keyboardHeight
  }

  setBottomOffset(value: number) {
    this._bottomOffset = value
  }

  getBottomOffset() {
    return this._bottomOffset
  }

  setIsFirstLayout(value: boolean) {
    this._isFirstLayout = value
  }

  getIsFirstLayout() {
    return this._isFirstLayout
  }

  setIsTypingDisabled(value: boolean) {
    this.setState({
      typingDisabled: value,
    })
  }

  getIsTypingDisabled() {
    return this.state.typingDisabled
  }

  setIsMounted(value: boolean) {
    this._isMounted = value
  }

  getIsMounted() {
    return this._isMounted
  }

  getMinInputToolbarHeight() {
    return this.props.renderAccessory
      ? this.props.minInputToolbarHeight! * 2
      : this.props.minInputToolbarHeight
  }

  calculateInputToolbarHeight(composerHeight: number) {
    return (
      composerHeight +
      (this.getMinInputToolbarHeight()! - this.props.minComposerHeight!)
    )
  }

  /**
   * Returns the height, based on current window size, without taking the keyboard into account.
   */
  getBasicMessagesContainerHeight(composerHeight = this.state.composerHeight) {
    return (
      this.getMaxHeight()! - this.calculateInputToolbarHeight(composerHeight!)
    )
  }

  /**
   * Returns the height, based on current window size, taking the keyboard into account.
   */
  getMessagesContainerHeightWithKeyboard(
    composerHeight = this.state.composerHeight,
  ) {
    return (
      this.getBasicMessagesContainerHeight(composerHeight) -
      this.getKeyboardHeight() +
      this.getBottomOffset()
    )
  }

  prepareMessagesContainerHeight(value: number) {
    if (this.props.isAnimated === true) {
      return new Animated.Value(value)
    }
    return value
  }

  safeAreaIphoneX = (bottomOffset: number) => {
    if (isIphoneX()) {
      return bottomOffset === this._bottomOffset ? 33 : bottomOffset
    }
    return bottomOffset
  }

  onKeyboardWillShow = (e: any) => {
    this.setIsTypingDisabled(true)
    this.setKeyboardHeight(
      e.endCoordinates ? e.endCoordinates.height : e.end.height,
    )
    this.setBottomOffset(this.safeAreaIphoneX(this.props.bottomOffset!))
    const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard()
    if (this.props.isAnimated === true) {
      Animated.timing(this.state.messagesContainerHeight!, {
        toValue: newMessagesContainerHeight,
        duration: 210,
      }).start()
    } else {
      this.setState({
        messagesContainerHeight: newMessagesContainerHeight,
      })
    }
  }

  onKeyboardWillHide = (_e: any) => {
    this.setIsTypingDisabled(true)
    this.setKeyboardHeight(0)
    this.setBottomOffset(0)
    const newMessagesContainerHeight = this.getBasicMessagesContainerHeight()
    if (this.props.isAnimated === true) {
      Animated.timing(this.state.messagesContainerHeight!, {
        toValue: newMessagesContainerHeight,
        duration: 210,
      }).start()
    } else {
      this.setState({
        messagesContainerHeight: newMessagesContainerHeight,
      })
    }
  }

  onKeyboardDidShow = (e: any) => {
    if (Platform.OS === 'android') {
      this.onKeyboardWillShow(e)
    }
    this.setIsTypingDisabled(false)
  }

  onKeyboardDidHide = (e: any) => {
    if (Platform.OS === 'android') {
      this.onKeyboardWillHide(e)
    }
    this.setIsTypingDisabled(false)
  }

  scrollToBottom(animated = true) {
    if (this._messageContainerRef) {
      this._messageContainerRef.scrollTo({ offset: 0, animated })
    }
  }

  renderMessages() {
    const AnimatedView = this.props.isAnimated === true ? Animated.View : View
    return (
      <AnimatedView
        style={{
          height: this.state.messagesContainerHeight,
        }}
      >
        <MessageContainer
          {...this.props}
          invertibleScrollViewProps={this.invertibleScrollViewProps}
          messages={this.getMessages()}
          ref={(ref) => {
            this._messageContainerRef = ref;

            if (this.props.setCustomRef) {
              this.props.setCustomRef(ref);
            }
          }}
        />
        {this.renderChatFooter()}
      </AnimatedView>
    )
  }

  onSend = (messages: TMessage[] = [], shouldResetInputToolbar = false) => {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    const newMessages: TMessage[] = messages.map(message => {
      return {
        ...message,
        user: this.props.user!,
        createdAt: new Date(),
        _id: this.props.messageIdGenerator && this.props.messageIdGenerator(),
      }
    })

    if (shouldResetInputToolbar === true) {
      this.setIsTypingDisabled(true)
      this.resetInputToolbar()
    }
    if (this.props.onSend) {
      this.props.onSend(newMessages)
    }
    this.scrollToBottom()

    if (shouldResetInputToolbar === true) {
      setTimeout(() => {
        if (this.getIsMounted() === true) {
          this.setIsTypingDisabled(false)
        }
      }, 100)
    }
  }

  resetInputToolbar() {
    if (this.textInput) {
      this.textInput.clear()
    }
    this.notifyInputTextReset()
    const newComposerHeight = this.props.minComposerHeight
    const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(
      newComposerHeight,
    )
    this.setState({
      text: this.getTextFromProp(''),
      composerHeight: newComposerHeight,
      messagesContainerHeight: this.prepareMessagesContainerHeight(
        newMessagesContainerHeight,
      ),
    })
  }

  focusTextInput() {
    if (this.textInput) {
      this.textInput.focus()
    }
  }

  onInputSizeChanged = (size: { height: number }) => {
    const newComposerHeight = Math.max(
      this.props.minComposerHeight!,
      Math.min(this.props.maxComposerHeight!, size.height),
    )
    const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(
      newComposerHeight,
    )
    this.setState({
      composerHeight: newComposerHeight,
      messagesContainerHeight: this.prepareMessagesContainerHeight(
        newMessagesContainerHeight,
      ),
    })
  }

  onInputTextChanged = (text: string) => {
    if (this.getIsTypingDisabled()) {
      return
    }
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged(text)
    }
    // Only set state if it's not being overridden by a prop.
    if (this.props.text === undefined) {
      this.setState({ text })
    }
  }

  notifyInputTextReset() {
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged('')
    }
  }

  onInitialLayoutViewLayout = (e: any) => {
    const { layout } = e.nativeEvent
    if (layout.height <= 0) {
      return
    }
    this.notifyInputTextReset()
    this.setMaxHeight(layout.height)
    const newComposerHeight = this.props.minComposerHeight
    const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(
      newComposerHeight,
    )
    const initialText = this.props.initialText || ''
    this.setState({
      isInitialized: true,
      text: this.getTextFromProp(initialText),
      composerHeight: newComposerHeight,
      messagesContainerHeight: this.prepareMessagesContainerHeight(
        newMessagesContainerHeight,
      ),
    })
  }

  onMainViewLayout = (e: any) => {
    // fix an issue when keyboard is dismissing during the initialization
    const { layout } = e.nativeEvent
    if (
      this.getMaxHeight() !== layout.height ||
      this.getIsFirstLayout() === true
    ) {
      this.setMaxHeight(layout.height)
      this.setState({
        messagesContainerHeight: this.prepareMessagesContainerHeight(
          this.getBasicMessagesContainerHeight(),
        ),
      })
    }
    if (this.getIsFirstLayout() === true) {
      this.setIsFirstLayout(false)
    }
  }

  renderInputToolbar() {
    const inputToolbarProps = {
      ...this.props,
      text: this.getTextFromProp(this.state.text!),
      composerHeight: Math.max(
        this.props.minComposerHeight!,
        this.state.composerHeight!,
      ),
      onSend: this.onSend,
      onInputSizeChanged: this.onInputSizeChanged,
      onTextChanged: this.onInputTextChanged,
      textInputProps: {
        ...this.props.textInputProps,
        ref: (textInput: any) => (this.textInput = textInput),
        maxLength: this.getIsTypingDisabled() ? 0 : this.props.maxInputLength,
      },
    }
    if (this.props.renderInputToolbar) {
      return this.props.renderInputToolbar(inputToolbarProps)
    }
    return <InputToolbar {...inputToolbarProps} />
  }

  renderChatFooter() {
    if (this.props.renderChatFooter) {
      return this.props.renderChatFooter()
    }
    return null
  }

  renderLoading() {
    if (this.props.renderLoading) {
      return this.props.renderLoading()
    }
    return null
  }

  render() {
    if (this.state.isInitialized === true) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <GiftedActionSheet
            ref={(component: any) => (this._actionSheetRef = component)}
          >
            <View style={styles.container} onLayout={this.onMainViewLayout}>
              {this.renderMessages()}
              {this.renderInputToolbar()}
            </View>
          </GiftedActionSheet>
        </SafeAreaView>
      )
    }
    return (
      <View style={styles.container} onLayout={this.onInitialLayoutViewLayout}>
        {this.renderLoading()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
})

export * from './types'

export {
  GiftedChat,
  Actions,
  Avatar,
  Bubble,
  SystemMessage,
  MessageImage,
  MessageText,
  Composer,
  Day,
  InputToolbar,
  LoadEarlier,
  Message,
  MessageContainer,
  Send,
  Time,
  GiftedAvatar,
  utils,
}
