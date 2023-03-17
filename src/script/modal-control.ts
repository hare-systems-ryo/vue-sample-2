export interface ModalControl<T = any> {
  /**
   * showBefre,showAfter がasync付きならasync付き関数になります。
   */
  show: (() => void) | (() => Promise<void>);
  /**
   * showBefore モーダルが開く前に実行される関数
   * - true をreturnするとモーダルを開く処理は中止される
   */
  showBefore: OptionalFunction<T>;
  showAfter: OptionalFunction<T>;
  /**
   * closeBefore,closeAfter がasync付きならasync付き関数になります。
   */
  close: () => void;
  /**
   * closeBefore モーダルが閉じる前に実行される関数
   * - true をreturnするとモーダルを閉じる処理は中止される
   */
  closeBefore: OptionalFunction<T>;
  closeAfter: OptionalFunction<T>;
  //状態管理
  isOpen: boolean;
  //データ保持
  state: T;
}

type OptionalFunction<T> = ((state: T) => void | boolean) | ((state: T) => Promise<void | boolean>) | null;

export const InitModalControl = <T = any>(arg?: {
  state?: T;
  closeBefore?: OptionalFunction<T>;
  closeAfter?: OptionalFunction<T>;
  showBefore?: OptionalFunction<T>;
  showAfter?: OptionalFunction<T>;
}): ModalControl<T> => {
  // if (arg === undefined) arg = {};
  const noneInitMessage = 'が初期化されていません';
  const ret: ModalControl = {
    show: () => console.log('[show]' + noneInitMessage),
    showBefore: null,
    showAfter: null,
    close: () => console.log('[close]' + noneInitMessage),
    closeBefore: null,
    closeAfter: null,
    isOpen: false,
    state: null,
    ...arg,
  };
  return ret;
};

const isAsync = (func: any) => {
  try {
    if (func === null) return false;
    if (func === undefined) return false;
    if (!('constructor' in func)) return false;
    return func.constructor.name === 'AsyncFunction';
  } catch {
    return false;
  }
};

/**
 * modalオブジェクトの初期化
 * @param modal ModalControlが含まれるReactiveオブジェクト
 * @param nextTick Vue の nextTick関数
 */
export const InitModals = (modal: any, nextTick: any) => {
  Object.keys(modal).forEach((key) => {
    const m: ModalControl = (modal as any)[key];
    if (isAsync(m.showBefore) || isAsync(m.showAfter)) {
      m.show = async () => {
        if (m.showBefore) {
          if (isAsync(m.showBefore)) {
            if ((await m.showBefore(modal.test.state)) === true) {
              console.info('モーダルのShow動作はキャンセルされました');
              return;
            }
          } else {
            if (m.showBefore(modal.test.state) === true) {
              console.info('モーダルのShow動作はキャンセルされました');
              return;
            }
          }
        }
        m.isOpen = true;
        if (!m.showAfter) return;
        await nextTick();
        if (isAsync(m.showAfter)) {
          await m.showAfter(modal.test.state);
        } else {
          m.showAfter(modal.test.state);
        }
      };
    } else {
      m.show = () => {
        if (m.showBefore) {
          if (m.showBefore(modal.test.state) === true) return;
        }
        m.isOpen = true;
        if (!m.showAfter) return;
        nextTick(() => {
          if (!m.showAfter) return;
          m.showAfter(modal.test.state);
        });
      };
    }
    if (isAsync(m.showBefore) || isAsync(m.showAfter)) {
      m.close = async () => {
        if (m.closeBefore) {
          if (isAsync(m.closeBefore)) {
            if ((await m.closeBefore(modal.test.state)) === true) {
              console.info('モーダルのClose動作はキャンセルされました');
              return;
            }
          } else {
            if (m.closeBefore(modal.test.state) === true) {
              console.info('モーダルのClose動作はキャンセルされました');
              return;
            }
          }
        }
        m.isOpen = false;
        await nextTick();
        if (!m.closeAfter) return;
        if (isAsync(m.closeAfter)) {
          await m.closeAfter(modal.test.state);
        } else {
          m.closeAfter(modal.test.state);
        }
      };
    } else {
      m.close = () => {
        if (m.closeBefore) {
          if (m.closeBefore(modal.test.state) === true) {
            console.info('モーダルのClose動作はキャンセルされました');
            return;
          }
        }
        m.isOpen = false;
        if (!m.closeAfter) return;
        nextTick(() => {
          if (!m.closeAfter) return;
          m.closeAfter(modal.test.state);
        });
      };
    }
  });
};
