class Quote {
  constructor(v) {
    this.v = v;
  }
}

export const q = (v) => {
  return new Quote(v);
};

export const mkProps = (properties) => {
  let resolve;
  let p = new Promise(function(resolveFn) {resolve = resolveFn;});
  let propResolve = (async function*() { yield []; return await p;})();
  if(!properties) return [propResolve, properties];
  Object.keys(properties).forEach(k => {
    let v = properties[k];
    if(v instanceof Quote) {
      // Unwrap quotes
      properties[k] = v.v;
    } else if(handlerNames.includes(k)) {
      if(v === true) {
        properties[k] = function(res) { resolve(res); };
      } else if(typeof v === 'function') {
        properties[k] = function(res) { resolve(v(res)); };
      }
    }
  });
  return [propResolve, properties];
};

const handlerNames = [
  "onAnimationStart",
  "onAnimationEnd",
  "onAnimationIteration",
  "onTransitionEnd",
  "onToggle",
  "onError",
  "onLoad",
  "onAbort",
  "onCanPlay",
  "onCanPlayThrough",
  "onDurationChange",
  "onEmptied",
  "onEncrypted",
  "onEnded",
  "onLoadedData",
  "onLoadedMetadata",
  "onLoadStart",
  "onPause",
  "onPlay",
  "onPlaying",
  "onProgress",
  "onRateChange",
  "onSeeked",
  "onSeeking",
  "onStalled",
  "onSuspend",
  "onTimeUpdate",
  "onVolumeChange",
  "onWaiting",
  "onCopy",
  "onCut",
  "onPaste",
  "onCompositionEnd",
  "onCompositionStart",
  "onCompositionUpdate",
  "onKeyDown",
  "onKeyPress",
  "onKeyUp",
  "onKeyEnter",
  "onFocus",
  "onBlur",
  "onChange",
  "onInput",
  "onInvalid",
  "onSubmit",
  "onClick",
  "onContextMenu",
  "onDoubleClick",
  "onDrag",
  "onDragEnd",
  "onDragEnter",
  "onDragExit",
  "onDragLeave",
  "onDragOver",
  "onDragStart",
  "onDrop",
  "onMouseDown",
  "onMouseEnter",
  "onMouseLeave",
  "onMouseMove",
  "onMouseOut",
  "onMouseOver",
  "onMouseUp",
  "onSelect",
  "onTouchCancel",
  "onTouchEnd",
  "onTouchMove",
  "onTouchStart",
  "onScroll",
  "onWheel",
  "onAnimationStartCapture",
  "onAnimationEndCapture",
  "onAnimationIterationCapture",
  "onTransitionEndCapture",
  "onToggleCapture",
  "onErrorCapture",
  "onLoadCapture",
  "onAbortCapture",
  "onCanPlayCapture",
  "onCanPlayThroughCapture",
  "onDurationChangeCapture",
  "onEmptiedCapture",
  "onEncryptedCapture",
  "onEndedCapture",
  "onLoadedDataCapture",
  "onLoadedMetadataCapture",
  "onLoadStartCapture",
  "onPauseCapture",
  "onPlayCapture",
  "onPlayingCapture",
  "onProgressCapture",
  "onRateChangeCapture",
  "onSeekedCapture",
  "onSeekingCapture",
  "onStalledCapture",
  "onSuspendCapture",
  "onTimeUpdateCapture",
  "onVolumeChangeCapture",
  "onWaitingCapture",
  "onCopyCapture",
  "onCutCapture",
  "onPasteCapture",
  "onCompositionEndCapture",
  "onCompositionStartCapture",
  "onCompositionUpdateCapture",
  "onKeyDownCapture",
  "onKeyPressCapture",
  "onKeyUpCapture",
  "onFocusCapture",
  "onBlurCapture",
  "onChangeCapture",
  "onInputCapture",
  "onInvalidCapture",
  "onSubmitCapture",
  "onClickCapture",
  "onContextMenuCapture",
  "onDoubleClickCapture",
  "onDragCapture",
  "onDragEndCapture",
  "onDragEnterCapture",
  "onDragExitCapture",
  "onDragLeaveCapture",
  "onDragOverCapture",
  "onDragStartCapture",
  "onDropCapture",
  "onMouseDownCapture",
  "onMouseEnterCapture",
  "onMouseLeaveCapture",
  "onMouseMoveCapture",
  "onMouseOutCapture",
  "onMouseOverCapture",
  "onMouseUpCapture",
  "onSelectCapture",
  "onTouchCancelCapture",
  "onTouchEndCapture",
  "onTouchMoveCapture",
  "onTouchStartCapture",
  "onScrollCapture",
  "onWheelCapture"
];
