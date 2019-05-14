declare module '@youi/react-native-youi' {
  import * as React from 'react';
  import { TextInputProps, TextStyle, ScrollViewProps, NativeEventSubscription, FlatListProps } from 'react-native';

  export interface BackHandlerConstructor {
    exitApp: () => void;

    addEventListener: (event: string, callback: () => void) => NativeEventSubscription;

    removeEventListener: (event: string, callback: () => void) => void;
  }

  export const BackHandler: BackHandlerConstructor;

  // Used for YOUI element ref callbacks (e.g. onLoad, onCompleted, etc).
  export type RefCallback<ElementType> = (ref: ElementType) => any;

  export interface InputEventObject {
    eventType: 'up' | 'down';
  }

  export type InputEventCallback = (event: InputEventObject) => void;

  export interface InputConstructor {
    addEventListener: (key: string, callback: InputEventCallback) => void;

    removeEventListener: (key: string, callback: InputEventCallback) => void;
  }

  export const Input: InputConstructor;

  export type SliderRefProps = {
    ref?: string | SliderRefFunction;

    name: string;

    disabled?: boolean;

    style?: React.CSSProperties;

    value?: number;

    thumbTintColor?: string;

    minimumTrackTintColor?: string;

    maximumTrackTintColor?: string;

    onValueChange?: (value: number) => void;

    onSlidingComplete?: () => void;

    onFocus?: () => void;

    onBlur?: () => void;
  };

  type SliderRefFunction = (slider: React.RefObject<Slider> & SliderRef) => void;

  export interface DimensionsConstructor {
    get: (
      type: string,
    ) => {
      width: number;
      height: number;
    };
  }

  export const Dimensions: DimensionsConstructor;

  export interface SliderProps {
    ref?: string | SliderRefFunction;

    disabled?: boolean;

    style?: React.CSSProperties;

    value?: number;

    thumbTintColor?: string;

    minimumTrackTintColor?: string;

    maximumTrackTintColor?: string;

    onValueChange?: (value: number) => void;

    onFocus?: () => void;

    onBlur?: () => void;
  }

  export interface RefProps {
    name: string;

    children?: any;

    focusable?: boolean;

    onLoad?: (ref: any) => void;

    onFocus?: (e: any) => void;

    onBlur?: (e: any) => void;

    onFocusInDescendants?: () => void;

    onBlurInDescendants?: () => void;
  }

  export interface VideoRefProps {
    onBufferingStarted: () => void;

    onBufferingEnded: () => void;

    onErrorOccurred: () => void;

    onPreparing: () => void;

    onReady: () => void;

    onPlaying: () => void;

    onPaused: () => void;

    onPlaybackComplete: () => void;

    onFinalized: () => void;

    onCurrentTimeUpdated: () => void;

    onDurationChanged: () => void;

    onStateChanged: (evt: VideoStateChangeEvent) => void;

    onAvailableAudioTracksChanged: () => void;

    onAvailableClosedCaptionsTracksChanged: () => void;

    source: VideoUriSource;
  }

  export class VideoRef extends React.Component<RefProps & Partial<VideoRefProps>> {
    seek: (value: number) => void;

    play: () => void;

    pause: () => void;

    stop: () => void;

    onPlaybackComplete: () => void;

    reactTag: number;
  }

  interface VideoUriSource {
    uri: string;
    type: string;
  }

  export interface BackgroundNotificationInfo {
    title: string;
    text: string;
    fastForwardIncrementMs: number;
    rewindIncrementMs: number;
    imageUri: string;
  }

  export interface BackgroundPlaybackProps {
    backgroundPlaybackEnabled: boolean;
    backgroundNotificationInfo: Partial<BackgroundNotificationInfo>;
  }

  export type VideoRefFunction = (video: VideoRef) => void;

  export type VideoStateChangeEvent = {
    nativeEvent: {
      playbackState: 'paused' | 'playing' | 'buffering',
      mediaState: 'unloaded' | 'ready' | 'preparing',
    }
  }

  type VideoErrorType = {
    nativeEvent: {
      message: string,
      errorCode: number,
    },
  };

  export type VideoProps = {
    style?: any;

    paused?: boolean;

    source: VideoUriSource;

    maxBitrate? : number;

    selectedClosedCaptionsTrack?: number;

    ref?: VideoRefFunction;

    onReady?: () => void;

    onPreparing?: () => void;

    onBufferingStarted?: () => void;

    onBufferingEnded?: () => void;

    onStateChanged?: (update: VideoStateChangeEvent) => void;

    onDurationChanged?: (update: any) => void;

    onCurrentTimeUpdated?: (update: any) => void;

    onErrorOccurred?: (error: VideoErrorType) => void;

    onPlaybackComplete?: () => void;

    onAvailableClosedCaptionsTracksChanged?: (closedCaptionTracks: any) => void;

    onFinalized?: () => void;
  } & Partial<BackgroundPlaybackProps>;

  export interface TextRefProps {
    name: string;

    text?: string;

    style?: TextStyle;

    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';

    numberOfLine?: number;

    focusable?: boolean;

    visible?: boolean;

    tracking?: number;
  }

  export interface CompositionProps {
    source: string;

    loadSync?: boolean;

    onTimelinesLoaded?(): void;
  }

  export class Composition extends React.Component<CompositionProps> {}

  export class TextInputRef extends React.Component<RefProps & TextInputProps> {
    focus(): void;

    activate(): void;

    blur(): void;

    isFocused(): boolean;

    clear(): void;
  }

  export class TextRef extends React.Component<RefProps & TextRefProps, {}> {}

  type Ref = any;

  interface FocusManagerInterface {
    getTag(refOrTag: Ref): void;

    /**
     * Requests that focus be moved to the component with the given tag.
     *
     * @param refOrTag The ref or a node handle of the component.
     */
    focus(refOrTag: Ref): void;

    /**
     * Controls whether the component with the given ref/tag is a focus root.
     *
     * @param refOrTag The ref or a node handle of the component.
     * @param isFocusRoot True if the component should be a focus root; false otherwise.
     */
    setFocusRoot(refOrTag: Ref, isFocusRoot: boolean): void;

    /**
     * Sets the focus path between the two components with the given refs/tags in the given direction.
     *
     * @param fromRefOrTag The ref or a node handle of the component from which the focus path originates.
     * @param toRefOrTag The ref or a node handle of the component at which the focus path terminates.
     * @param focusDirection The direction of the focus path. Valid directions are: "up", "down", "right", "left", "forward" and "reverse".
     */
    setNextFocus(
      fromRefOrTag: Ref,
      toRefOrTag: Ref,
      focusDirection: 'up' | 'down' | 'right' | 'left' | 'forward' | 'reverse',
    ): void;
  }

  export const FocusManager: FocusManagerInterface;

  export interface ButtonRefProps {
    visible?: boolean;

    enabled?: boolean;

    text?: string;

    onClick?(): void;

    onPress?(): void;

    onFocus?(): void;

    onBlur?(): void;

    onTimelinesLoaded?(timelines: { [key: string]: TimelineRef }): void;
  }

  export class ButtonRef extends React.Component<RefProps & ButtonRefProps> {}

  export type FormFactorTypes = 'TV' | 'Handset' | 'Tablet';

  type FormFactorSelect<T> = {
    TV?: T;
    Handset?: T;
    Tablet?: T;
    default?: T;
  };

  export interface FormFactorInterface {
    isTV: boolean;

    isHandset: boolean;

    isTablet: boolean;

    formFactor: FormFactorTypes;

    select<T>(obj: FormFactorSelect<T>): T;
  }

  export const FormFactor: FormFactorInterface;

  interface ImageURISource {
    uri?: string;
    width?: number;
    height?: number;
  }

  export interface ImageRefProps {
    source?: ImageURISource;

    style?: {
      width?: number;
      height?: number;
      tintColor?: string;
    };

    visible?: boolean;

    resizeMode: 'contain' | 'cover' | 'stretch' | 'center' | 'repeat';

    onTimelinesLoaded?(): void;

    onLoad?(): void;

    onLoadEnd?(): void;

    onLoadStart?(): void;

    onError?(): void;
  }

  export class ImageRef extends React.Component<ImageRefProps & RefProps> {}

  export interface ListItem<T> {
    item: T;
    index: number;
  }

  export interface ListRefProps<T> {
    extraData?: boolean;

    listKey?: string;

    initialScrollIndex?: number;

    horizontal?: boolean;

    initialNumToRender?: number;

    updateCellsBatchingPerioed?: number;

    maxToRenderPerBatch?: number;

    updateCellsBatchingPeriod?: number;

    windowSize?: number;

    numColumns?: number;

    data: T[];

    scrollEnabled?: boolean;

    renderItem: (item: ListItem<T>) => React.ReactNode;

    ListHeaderComponent?: React.ComponentType | React.ReactElement<any>;

    ListFooterComponent?: React.ComponentType | React.ReactElement<any>;

    ListEmptyComponent?: React.ComponentType | React.ReactElement<any>;

    onScroll?: ScrollViewProps['onScroll'];

    scrollEventThrottle?: ScrollViewProps['scrollEventThrottle'];

    snapToAlignment?: string;

    snapToInterval?: number;

    getItemLayout?: (
      data: T,
      index: number,
    ) => {
      index: number;
      length: number;
      offset: number;
    };

    getItem?(): {};

    getItemCount?(): number;

    onEndReached?: FlatListProps<T>['onEndReached'];

    onEndReachedThreshold?: FlatListProps<T>['onEndReachedThreshold'];

    onContentSizeChange?: FlatListProps<T>['onContentSizeChange'];

    onMomentumScrollBegin?: FlatListProps<T>['onMomentumScrollBegin'];

    onMomentumScrollEnd?: FlatListProps<T>['onMomentumScrollEnd'];

    onLayout?(): void;

    onScrollToIndexFailed?(): void;

    onViewableItemsChanged?(): void;

    keyExtractor?(item: T, index: number): string;
  }

  export class ListRef<T> extends React.Component<ListRefProps<T> & RefProps> {
    scrollToIndex(params: { index: number; animated?: boolean; viewPosition?: number }): void;
  }

  export class ScrollRef extends React.Component<RefProps & ScrollViewProps> {}

  export interface TimelineRef {
    /**
     * This is very useful for debugging. Whenever we see an assertion about a timeline
     * there's usually a tag mentioned somewhere in the message. This tag is equal
     * to _timelineId. Thanks to that we can identify the culprit.
     */
    _timelineId: number;

    play(): void;

    pause(): void;

    start(): void;

    stop(): void;

    abort(): void;

    seek(time: number | string): void;
  }

  export interface TimelineRefProps {
    name: string;

    direction?: 'forward' | 'reverse';

    loop?: boolean;

    onLoad?: (ref: TimelineRef) => void;

    onAborted?(): void;

    onCompleted?(): void;

    onPaused?(): void;

    onPlay?(): void;

    onStarted?(): void;

    onCompletedForward?(): void;

    onPausedForward?(): void;

    onPlayForward?(): void;

    onStartedForward?(): void;

    onCompletedReverse?(): void;

    onPausedReverse?(): void;

    onPlayReverse?(): void;

    onStartedReverse?(): void;
  }

  export class TimelineRef extends React.Component<RefProps & TimelineRefProps> {}

  export class Video extends React.Component<VideoProps> {
    static getClosedCaptionsOffId(): number;
    static getClosedCaptionsTrackId(tracks: number[], selectedTrack: number): number;
  }

  export class Slider extends React.Component<SliderProps> {}

  export class SliderRef extends React.Component<SliderRefProps> {}

  export interface ViewRefProps {
    name: string;

    key?: string;

    onFocus?: () => void;

    visible?: boolean;

    onTimelinesLoaded?(): void;
  }

  export class ViewRef extends React.Component<RefProps & ViewRefProps> {}
}
