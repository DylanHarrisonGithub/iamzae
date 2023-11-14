import React from "react";

const News: React.FC<any> = (props: any) => {
  return (
    <div className="pt-16">News
        <div className="bg-purple-500 text-center p-8">
          {
            Array(12).fill(0).map(u => (
              <div className='inline-block relative glass w-56 h-56 mx-2 my-1 rounded-md shadow-lg hover:shadow-xl cursor-pointer'>
                <div className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 m-0">
                  <svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 448 512" className="block mx-auto"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>          

                  <p className='mt-4'>Media</p>
                </div>
              </div>
            ))
          }
        </div>

    </div>
  )
}

export default News;