import React from "react";
import { Link } from 'react-router-dom';

export type CarouselProps = {
  categoryName?: string,
  disableBrowseAll?: boolean,
  onScrollLeftEnd?: () => any,
  onScrollRightEnd?: () => any,
  children: React.ReactNode[]
}

const useIsOverflow = (ref: React.RefObject<any>, callback?: (hasOverflow: boolean) => any) => {
  const [isOverflow, setIsOverflow] = React.useState<boolean | undefined>(undefined);

  React.useLayoutEffect(() => {
    const { current } = ref;

    const trigger = () => {
      const hasOverflow = current.scrollWidth > current.clientWidth;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if (current) {
      trigger();
    }
  }, [callback, ref]);

  return isOverflow;
};

const Carousel: React.FC<CarouselProps> = (props: CarouselProps) => {

  const ref = React.useRef<HTMLDivElement>(null);
  const isOverflow = useIsOverflow(ref);

  //const [scroll, setScroll] = React.useState<number>(0);

  return (
    <div className="relative m-2">
      {
        //props.categoryName &&2336 2720 -= 384
          <h2 className="inline-block text-white">{props.categoryName}</h2>
      }
      {
        !props.disableBrowseAll &&
        <h2 className="inline-block float-right mr-1">
          <Link to={"/"+props.categoryName!.replaceAll(' ', '')} className="link link-primary">Browse All</Link>
        </h2>
      }

      
      <div className="carousel carousel-center rounded-box" ref={ref}>
        {
          props.children.map((node, i) => (
            <div className="carousel-item m-2" key={i}>
              { node }
            </div>
          ))
        }
      </div>

      {
        isOverflow && 
        <a 
          className="absolute z-10 btn btn-circle text-4xl left-5 top-1/2 p-8 glass cursor-pointer" 
          // href={'#'+props.categoryName.replaceAll(' ', '')+((scroll + props.children.length-1) % props.children.length)}
          // onClick={() => setScroll(s => (s + props.children.length-1) % props.children.length)}
          onClick={()=>{ 
            ref.current!.scrollLeft -= (1.0/props.children.length)*ref.current!.scrollWidth;
            if (ref.current!.scrollLeft <= 0) {
              props.onScrollLeftEnd && props.onScrollLeftEnd();
            }
          }}
        >
          <span className="absolute -translate-y-1/2 top-1/2 -translate-x-1/6 text-black">❮</span>
        </a>
      }

      {
        isOverflow &&
          <a 
            className="absolute z-10 btn btn-circle text-4xl right-5 top-1/2 p-8 glass cursor-pointer"
            // href={'#'+props.categoryName.replaceAll(' ', '')+((scroll + 1) % props.children.length)}
            onClick={()=>{ 
              ref.current!.scrollLeft += (1.0/props.children.length)*ref.current!.scrollWidth;
              if (ref.current!.scrollLeft >= (ref.current!.scrollWidth - ref.current!.clientWidth)) {
                props.onScrollRightEnd && props.onScrollRightEnd();
              }
            }}
            // onClick={()=>{ 
            //   ref.current!.scrollLeft += .6*ref.current!.clientWidth;
            //   // if (ref.current!.scrollLeft >= (ref.current!.clientWidth - .6*ref.current!.clientWidth)) {
            //   //   alert('scrolled max left')
            //   // }
            // }}
          >
            <span className="absolute -translate-y-1/2 top-1/2 -translate-x-1/6 text-black">❯</span>
          </a>
      }

    </div>
  )
}

export default Carousel;