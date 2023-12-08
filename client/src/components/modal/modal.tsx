import React, { Children } from 'react';

export type ModalProps = {
  children: React.ReactNode[] | React.ReactElement<any, any> | null
}

export const ModalContext = React.createContext<{
  toast: null | ((status: "alert" | "error" | "info" | "success" | "warning", text: string) => void),
  modal: null | ((
    m?: 
      { prompt: string, options: string[] } |
      {node: React.ReactNode | React.ReactElement<any, any>, resolve: ((...args: any[]) => any), reject: ((...args: any[]) => any)}
    ) => Promise<string | null> | void)
}>({
  toast: null,
  modal: null
});

const statusClass = {
  alert: "alert-info",
  error: "alert-error",
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning"
}

const Modal: React.FC<ModalProps> = (props: ModalProps) => {

  const [toasts, setToasts] = React.useState<{
    id: number
    status: "alert" | "error" | "info" | "success" | "warning", 
    text: string,
    timeout: ReturnType<typeof setTimeout>
  }[]>([]);

  const [_modal, setModal] = React.useState<null | {
    prompt: string,
    options: string[]
  }>(null);

  const [_modal2, setModal2] = React.useState<null | React.ReactNode | React.ReactElement<any, any>>(null);

  const _modalResolve = React.useRef<((value: null | string | Promise<string | null> | Promise<any | null>) => void) | null>(null);
  const _modalReject = React.useRef<((value: null | string | Promise<string | null>) => void) | null>(null);

  const toast = (status: "alert" | "error" | "info" | "success" | "warning", text: string) => {
    let t = {
      id: Math.random(), status: status, text: text
    };
    setToasts(prevToasts => [ ... prevToasts, { ... t, ...{ timeout: setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(tst => tst.id !== t.id))
    }, 5000)}}]);
  };

  const dismissToast = (id: number) => setToasts(prevToasts => prevToasts.filter(tst => tst.id !== id));

  const toastSVG = (stat: "alert" | "error" | "info" | "success" | "warning"): string => {
    switch(stat) {
      case 'alert':
        return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'error':
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'info':
        return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'success':
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'warning':
        return "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
    }
  }

  const modal = (
    m?: {prompt: string, options: string[]} |
    {node: React.ReactNode | React.ReactElement<any, any>, resolve: ((...args: any[]) => any), reject: ((...args: any[]) => any)}
  ): Promise<string | null> | void => {
    if (!_modal && m) {
      if ("prompt" in m && "options" in m) {
        return new Promise<string | null>((res, rej) => {
          _modalResolve.current = res;
          _modalReject.current = rej;
          setModal({prompt: m!.prompt, options: m!.options});
        });        
      } else if ("node" in m && "resolve" in m && "reject" in m) {
        _modalResolve.current = m.resolve;
        _modalReject.current = m.reject;
        setModal2(m.node);
      }
    } else {
      // console.log('delete');
      _modalResolve.current = null;
      _modalReject.current = null;
      setModal(null);
      setModal2(null);
    }
  }

  // const modal2 = (m?: {node: React.ReactNode| React.ReactElement<any, any>, resolve: ((...args: any[]) => any), reject: ((...args: any[]) => any)}) => {
  //   if (!_modal && !_modal2 && m) {
  //     setModal2(m.node);
  //     _modalResolve.current = m.resolve;
  //     _modalReject.current = m.reject;
  //   } else {
  //     _modalResolve.current = null;
  //     _modalReject.current = null;
  //     setModal2(null);
  //   }
  // }

  return (
    <div className="p-0 m-0">
      <ModalContext.Provider value={{toast: toast, modal: modal}}>
        {
          props.children
        }
      </ModalContext.Provider>
      {
        (_modal2 && _modalResolve.current && _modalReject.current) && (
          <div className="fixed left-0 top-0 w-full h-full bg-slate-500/50 z-40"
            onClick={() => { _modalReject.current!(null); modal(); }}
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded p-5"
              onClick={(e) => e.stopPropagation()}           
            >
              {_modal2}
            </div>           
          </div>
        )
      }
      {
        (_modal && _modalResolve.current && _modalReject.current) && (
          <div className="fixed left-0 top-0 w-full h-full bg-slate-500/50 z-40"
            onClick={() => { _modalReject.current!(null); modal(); }}
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xl font-bold tracking-tight text-gray-600">{_modal.prompt}</p>
              <div className="flex justify-end">
                {
                  _modal.options.map((opt, key) => <button className="btn btn-primary ml-3 mt-4 mb-1" key={key} onClick={(e) => {_modalResolve.current!(opt); modal();}}>{opt}</button>)
                }
              </div>
            </div>
          </div>
        )
      }
      <div className="fixed bottom-0 container p-4 z-50 transition-all duration-500 ease-in-out">

        {
          toasts.map((t, i) => (
            <div className={`alert shadow-lg p-1 my-2 hover:cursor-pointer ${statusClass[t.status]}`} key={i} onClick={() => dismissToast(t.id)}>
              <div>
                <svg className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d={toastSVG(t.status)} 
                /></svg>
                <span>{t.text}</span>
              </div>
            </div>            
          ))
        }

      </div>
    </div>
  )
}

export default Modal;