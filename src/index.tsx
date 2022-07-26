import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { HTML } from './html';
import * as jsBuilder from './jsBuilder';

export interface EChartProps {
  onData?: (payload: any) => void;
  onLoadEnded?: () => void;
  backgroundColor?: string;
}

const EChartss: React.FC<EChartProps> = (props) => {
  const { onData, onLoadEnded, backgroundColor = 'rgba(0, 0, 0, 0)' } = props;

  const [callbacks, setCallbacks] = useState<{ [uuid: string]: any }>({});
  const webview = useRef<WebView>(null);

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      if (!e) return;

      const data = JSON.parse(e.nativeEvent.data);

      if (data.types === 'DATA') {
        onData?.(data.payload);
      } else if (data.types === 'CALLBACK') {
        const { uuid } = data;
        callbacks[uuid](data.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postMessage = (data: any) => {
    webview.current?.postMessage(jsBuilder.convertToPostMessageString(data));
  };

  const generateUUID = () => `_${Math.random().toString(36).substr(2, 9)}`;

  const setBackgroundColor = (color: string) => {
    const data = {
      types: 'SET_BACKGROUND_COLOR',
      color,
    };
    postMessage(data);
  };

  const getOption = (callback: any, properties: any) => {
    const uuid = generateUUID();
    setCallbacks((val) => {
      let newCallbacks = val;
      newCallbacks[uuid] = callback;
      return newCallbacks;
    });
    const data = {
      types: 'GET_OPTION',
      uuid,
      properties,
    };
    postMessage(data);
  };

  const setOption = (option: any, notMerge: boolean, lazyUpdate: boolean) => {
    const data = {
      types: 'SET_OPTION',
      payload: {
        option,
        notMerge: notMerge,
        lazyUpdate: lazyUpdate,
      },
    };
    postMessage(data);
  };

  const clear = () => {
    const data = {
      types: 'CLEAR',
    };
    postMessage(data);
  };

  const onLoadEnd = () => {
    webview.current?.injectJavaScript(jsBuilder.getJavascriptSource(props));
    onLoadEnded?.();
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webview}
        originWhitelist={['*']}
        scrollEnabled={false}
        source={{
          html: HTML,
          baseUrl: '',
        }}
        onMessage={onMessage}
        allowFileAccess
        allowUniversalAccessFromFileURLs
        mixedContentMode="always"
        onLoadEnd={onLoadEnd}
        androidHardwareAccelerationDisabled
      />
    </View>
  );
};

export default EChartss;
