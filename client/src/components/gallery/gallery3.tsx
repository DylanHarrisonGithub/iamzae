import React from "react";

type Gallery3Props = {
  children?: React.ReactNode[]
}

const Gallery3: React.FC<any> = (props: Gallery3Props) => {

  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const columnRefs = React.useRef([]);
  const [columns, setColumns] = React.useState<React.ReactNode[][]>([[],[],[],[],[],[]]);

  React.useEffect(() => {
    const tempColumns: React.ReactNode[][] = [[],[],[],[],[],[]];
    let cWidth = Math.floor((containerRef.current?.clientWidth || 290) / 290);
    props.children?.forEach((c, i) => {
      tempColumns[i % cWidth].push(c);
    });
    setColumns(tempColumns);
  }, [props.children, containerRef]);

  return (

    <div 
      className="mx-auto p-1 md:p-4 lg:p-8 text-center"
      ref={containerRef}
    >
      {
        [0,1,2,3].map(i => (
          <div 
            key={i}
            ref={columnRefs.current[i]}
            className={`inline-block md:w-72 m-1 align-top`}
          > 
            { columns[i] }
          </div>
        ))
      }

    </div>
  )
}

export default Gallery3;