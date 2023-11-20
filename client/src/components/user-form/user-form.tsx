import React from "react";
import config from "../../config/config";

import { User } from '../../models/models'

type Props = {
  user: User,
  avatarList: string[],
  resolve: (user: User) => any
};

const UserForm: React.FC<Props> = (props) => {

  const [user, setUser] = React.useState<User>(props.user);

  return (
    <form className="w-full max-w-sm">

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="inline-avatar"
          >
            <img src={config.ASSETS[config.ENVIRONMENT] + `media/${user.avatar}`} className="w-8 h-8 rounded-full float-right" />
          </label>
        </div>
        <div className="md:w-2/3">
          <select
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-avatar"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUser(prev => ({ ...prev, avatar: e.target.value}))}
            value={user.avatar}
          >
            {
              props.avatarList.map(a => (<option key={a} value={a}>{a}</option>))
            }
          </select>
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="inline-email"
          >
            Username
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-email"
            type="email"
            placeholder="jane.doe@example.com"
            value={user.username}
            onInput={(event: React.ChangeEvent<HTMLInputElement>) => setUser(prevUser => ({ ...prevUser, username: event.target.value}))}
          />
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="inline-privilege"
          >
            Privilege
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            disabled={true}
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-privilege"
            type="text"
            placeholder="guest"
            value={user.privilege}
            onInput={(event: React.ChangeEvent<HTMLInputElement>) => setUser(prevUser => ({ ...prevUser, privilege: event.target.value}))}
          />
        </div>
      </div>

      <div className="md:flex md:items-center">
        <div className="md:w-1/3"></div>
        <div className="md:w-2/3">
          <button
            className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={() => props.resolve(user)}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
