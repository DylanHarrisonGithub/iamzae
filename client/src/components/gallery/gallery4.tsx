import React from "react";

type Gallery4Props = {
  children?: React.ReactNode[],  // children should also possibly be a single react node
  minColumnWidth?: number,      // is it worth it to implement columns may stretch between min and max colwidth??
  maxColumnWidth?: number,
  maxColumns?: number
}

const Gallery4: React.FC<Gallery4Props> = ({ children, minColumnWidth = 400, maxColumnWidth = 400, maxColumns = 4 }) => {

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [columns, setColumns] = React.useState<React.ReactNode[][]>([...Array(maxColumns).keys()].map(i => []));

  React.useEffect(() => {
    setContainerWidth(containerRef.current?.clientWidth || 0);
    const resizeFn = () => setContainerWidth(containerRef.current?.clientWidth || 0);
    window.addEventListener('resize', resizeFn);
    return () => window.removeEventListener('resize', resizeFn);
  }, [containerRef]);

  React.useEffect(() => {
    if (containerRef.current) {
      let numColumns = Math.max(1, Math.min(Math.floor((containerRef.current?.clientWidth || 0) / (maxColumnWidth+2)), maxColumns));
      const tempColumns: React.ReactNode[][] = [...Array(numColumns).keys()].map(i => []);
      children?.forEach((c, i) => {
        tempColumns[i % numColumns].push(c);
      });
      setColumns(tempColumns);
    }
  }, [children, containerWidth]);

  return (

    <div 
      className="mx-auto p-1 text-center"
      ref={containerRef}
    >
      {/* <p className="text-white">{containerWidth}, {columns.length}</p> */}
      {
        columns.map((c, i) => (
          <div 
            key={i}
            className={`inline-block align-top`}
            style={{width: columns.length > 1 ? maxColumnWidth : '100%'}} //Math.min(maxColumnWidth, (containerWidth - 128) / maxColumns)}
          > 
            { c }
          </div>
        ))
      }

    </div>
  )
}

export default Gallery4;