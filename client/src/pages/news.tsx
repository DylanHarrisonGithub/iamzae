import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import InfiniteContentScroller from "../components/infinite-content-scroller/infinite-content-scroller";
import Update from "../components/update/update";

import { UpdateType } from "../models/models";

const News: React.FC<any> = (props: any) => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [updates, setUpdates] = React.useState<UpdateType[]>([]);
  const [search, setSearch] = React.useState<string>('');

  return (
    <div className="py-16 px-4 mx-auto fan">

      <div className="text-center p-1 m-3 mt-4">
        <div className='inline-block relative mx-2 my-4 align-top text-left w-11/12 md:w-4/12'>
          <div className="text-left">
            <h1 className="text-xl gold-text text-center align-middle inline-block">
              &nbsp;&nbsp;News&nbsp;&nbsp;
            </h1>
          </div>
        </div>

        <div className='inline-block relative mx-2 my-3 w-11/12 md:w-5/12 text-left'>
          <input
            className="bg-gray-200 text-left md:text-right appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
            placeholder="Search Updates"
            value={search}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {
        (id !== undefined) &&
          <div className="flex">
            <button 
              className="btn btn-circle btn-lg ml-auto"
              onClick={() => navigate('/admin/reviews')}
            >
              Close
            </button>
          </div>
      }

      <div className="p-1 m-3 rounded-lg glass">
        <InfiniteContentScroller<UpdateType> contentStreamingRoute={'updatestream'} content={updates} contentSetter={setUpdates} search={search} id={id}>
          {
            updates.map((u, i) => (<Update key={i} update={u} />))
          }
        </InfiniteContentScroller>
      </div>

    </div>
  );
}

export default News;