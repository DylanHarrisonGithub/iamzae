import React, { ReactElement } from "react";

import HttpService from "../../services/http.service";

import { ModalContext } from "../modal/modal";

type InfiniteContentScrollerProps<T> = {
  contentStreamingRoute: string,
  content: T[],
  contentSetter: React.Dispatch<React.SetStateAction<T[]>>,
  children: React.ReactNode[] | React.ReactNode,
  search?: string,
  id?: string
}

const InfiniteContentScroller = <T extends { id: number }>({
  contentStreamingRoute,
  content,
  contentSetter, 
  children,
  search,
  id
}: InfiniteContentScrollerProps<T>): ReactElement => {

  const infiniteScrollTriggerElementRef = React.useRef<HTMLDivElement | null>(null);

  const modalContext = React.useContext(ModalContext);

  const [busy, setBusy] = React.useState<boolean>(false);
  const [complete, setComplete] = React.useState<boolean>(false);

  const onScroll = async () => {
    if (infiniteScrollTriggerElementRef.current && !busy) {
      //console.log(window.scrollY, listInnerRef.current.getBoundingClientRect().top - window.innerHeight);
      if ((infiniteScrollTriggerElementRef.current.getBoundingClientRect().top - window.innerHeight < 0) && !busy && !complete) {
        //console.log('infinitescroll triggered');
        setBusy(true);

      }
    }
  };

  const infiniteScrollContentStream = async <T extends { id: number }>(
    setContent: React.Dispatch<React.SetStateAction<T[]>>,
    // contentStreamRoute: string, 
    afterID: number,
    // search?: string,
    // id?: number
  ) => {

    const streamRes = await HttpService.get<T[]>(contentStreamingRoute,
      (id !== undefined) ?
        { afterID: 0, numrows: 1, id: id }
      :
        search ? 
          { afterID: afterID || 0, numrows: 10, search: search }
        :
          { afterID: afterID || 0, numrows: 10 }
    );
    if (streamRes.success && streamRes.body) {
      if (streamRes.body.length < 10) {
        setComplete(true);
      }
      if (afterID) {
        setContent(content => [...content, ...streamRes.body!.filter(src => !content.some(u => u.id === src.id)) ].sort((a, b) => a.id! - b.id!));
      } else {
        setContent(streamRes.body);
      }
      [
        `GET request to ${contentStreamingRoute} successful.`,
        ...streamRes.messages || []
      ].forEach(m => modalContext.toast!('success', m));
    } else {
      [
        `GET request to ${contentStreamingRoute} failed.`,
        ...streamRes.messages || []
      ].forEach(m => modalContext.toast!('warning', m));
      setBusy(false);
    }
    setBusy(false);
  };

  React.useEffect(() => {
    if (busy) {
      infiniteScrollContentStream(contentSetter, content.length? content.at(-1)!.id : 0);
    }
  }, [busy]);

  React.useEffect(() => {
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll);

    if (!content.length) {
      setComplete(false);
      setBusy(true);
    }
    // Clean-up
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [content]);

  React.useEffect(() => {
    if (search !== undefined) {
      if (complete) {
        setComplete(false);
        contentSetter([]);
        setBusy(true);
      } else {
        contentSetter([]);
        setBusy(true);
      }
    }
  }, [search]);

  React.useEffect(() => { setBusy(true) }, []);

  return (
    <div>
      {/* <div className="fixed bg-white top-0 left-0 z-50">
        <p>busy: {busy.toString()}</p>
        <p>complete: {complete.toString()}</p>
      </div> */}
      { children }
      <div ref={infiniteScrollTriggerElementRef}>
        {
          busy &&
            <div className="text-center">
              <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        }
        { !!(!busy && !content.length) && <div className="text-center">no results</div> }
        { !!(complete && content.length) && <div className="text-center">no more results</div> } 
      </div>
    </div>
  );
}

export default InfiniteContentScroller;