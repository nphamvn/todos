// FixedTouchableHighlight.tsx
import React, { useRef } from "react";
import {
  TouchableHighlight,
  GestureResponderEvent,
  TouchableHighlightProps,
} from "react-native";

export default function FixedTouchableHighlight({
  onPress,
  onPressIn,
  ...props
}: TouchableHighlightProps) {
  const _touchActivatePositionRef = useRef<{
    pageX: number;
    pageY: number;
  } | null>(null);

  function _onPressIn(e: GestureResponderEvent) {
    const { pageX, pageY } = e.nativeEvent;

    _touchActivatePositionRef.current = {
      pageX,
      pageY,
    };

    onPressIn?.(e);
  }

  function _onPress(e: GestureResponderEvent) {
    if (!_touchActivatePositionRef.current) return;

    const { pageX, pageY } = e.nativeEvent;

    const absX = Math.abs(_touchActivatePositionRef.current.pageX - pageX);
    const absY = Math.abs(_touchActivatePositionRef.current.pageY - pageY);

    const dragged = absX > 2 || absY > 2;
    if (!dragged) {
      onPress?.(e);
    }
  }

  return (
    <TouchableHighlight onPressIn={_onPressIn} onPress={_onPress} {...props}>
      {props.children}
    </TouchableHighlight>
  );
}
