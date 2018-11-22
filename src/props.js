export const mkProps = (properties) => {
  let resolve;
  let p = new Promise(function(resolveFn) {resolve = resolveFn;});
  let propResolve = (async function*() { yield []; return await p;})();
  if(!properties) return [propResolve, properties, true];
  let isSimpleProps = true;
  Object.keys(properties).forEach(k => {
    if(handlerNamesMap.has(k)) {
      isSimpleProps = false;
      const v = properties[k];
      delete properties[k];
      const evtName = handlerNamesMap.get(k);
      // What should we do if we are overwriting an existing handler?
      if(properties.hasOwnProperty(evtName)) {
        // console.warn(`Existing event handler "${evtName}" overridden by Concur event handler`);
      }
      if(v === true) {
        // No value was provided
        properties[evtName] = function(res) { resolve(res); };
      } else if(typeof v === 'function') {
        // Value is a mapper function
        properties[evtName] = function(res) { resolve(v(res)); };
      } else {
        // Value is a constant
        properties[evtName] = function() { resolve(v); };
      }
    }
  });
  return [propResolve, properties, isSimpleProps];
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

const handlerNamesMap = new Map(handlerNames.map(h => ['c'+h, h]));
