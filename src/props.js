class Fn {
  constructor(fn) {
    this.fn = fn;
  }
}

export const mapProp = (f) => {
  return new Fn(f);
};

export const mkProps = (properties) => {
  let resolve;
  let p = new Promise(function(resolveFn) {resolve = resolveFn;});
  let propResolve = (async function*() { yield []; return await p;})();
  if(!properties) return [propResolve, properties];
  Object.keys(properties).forEach(k => {
    let v = properties[k];
    let f;
    if(v instanceof Fn) {
      f = v.fn;
    } else if(v === true) {
      f = x => x;
    } else {
      return;
    }
    if(handlerNames.includes(k)) {
      properties[k] = function(res) { resolve(f(res)); };
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
