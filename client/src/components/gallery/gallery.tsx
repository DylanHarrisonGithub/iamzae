import React from "react";

export type GalleryProps = {
  title?: string,
  children?: React.ReactNode[]
}

const Gallery: React.FC<any> = (props: GalleryProps) => {
  return (
    <div className="py-2">
      {
        props.title && <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-3 ml-3">{props.title}</h2>
      }
      <div className="mx-auto justify-center max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">


        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-">
          {
            React.Children.map(props.children, (node, i) => (
              <div key={i} className="flex justify-items-center justify-self-center">
                { node }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Gallery;