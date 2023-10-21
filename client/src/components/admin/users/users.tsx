import React from 'react';

import HttpService from '../../../services/http.service';
import { ModalContext } from '../../modal/modal';

import config from '../../../config/config';

import { User } from '../../../models/models';
import UserForm from '../../user-form/user-form';

type Props = {
  users: User[],
  avatarImages: string[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  quickGet: <T = void>(route: string) => Promise<T | void>
};

const Users: React.FC<Props> = ({users, avatarImages, setUsers, quickGet}) => {

  const modalContext = React.useContext(ModalContext);
  const init = React.useRef(true);

  React.useEffect(() => {
    if (init.current) {
      quickGet<User[]>('userlist').then(res => setUsers(res || []));
      init.current = false;
    }
  }, [users]);

  return (
    <span>



<div className="container mx-auto p-4 text-center">
        {users.map((user) => (
          <div key={user.id} className="shadow-xl glass p-4 lg:p-8 rounded-lg text-black inline-block mx-auto text-left md:text-center">
            <label className='avatar'>
              <div className="w-16 rounded-full inline-block">
                <img 
                  src={config.ASSETS[config.ENVIRONMENT] + `media/${user.avatar}`}
                  alt={`Avatar for ${user.username}`}
                />
              </div>
            </label>
            <div className="m-4 md:m-2 inline-block">
              <strong>ID:</strong> {user.id}
            </div>
            <div className="m-2 inline-block">
              <strong>Username:</strong> {user.username}
            </div>
            <div className="m-2 inline-block">
              <strong>Privilege:</strong> {user.privilege}
            </div>
            <div className='text-center md:inline-block'>
              <button
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 m-2 rounded mr-2 md:block md:w-full"
                onClick={async () => {
                  const confirmed = (await modalContext.modal!({ prompt: `Are you sure you want to delete user: ${user.username}?`, options: ['yes', 'no']})!) === 'yes';
                  confirmed && HttpService.delete<void>('userdelete', { id: user.id }).then(res => {
                    res.messages.forEach(m => modalContext.toast!(res.success ? 'success' : 'warning', m));
                    quickGet<User[]>('userlist').then(res => setUsers(res || []));
                  });
                }}
              >
                Delete
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 m-2 rounded md:block md:w-full"
                onClick={() => {
                  (new Promise<User>((res, rej) => {
                    modalContext.modal!({node: (
                      <UserForm user={user} resolve={res} avatarList={avatarImages}/>
                    ), resolve: res, reject: rej});
                  })).then(async ({ id, ...rest }) => {
                    modalContext.modal!();
                    // const { id, ...rest } = result;
                    const updateResponse = await HttpService.patch<void>('userupdate', { id: user.id, update: rest});
                    updateResponse.messages.forEach(m => modalContext.toast!(updateResponse.success ? 'success' : 'warning', m));
                    if (updateResponse.success) {
                      quickGet<User[]>('userlist').then(res => setUsers(res || []));
                    }
                  }).catch(err => {});
                }}
              >
                Edit
              </button>
            </div>

          </div>
        ))}
      </div>


    </span>
  );
}

export default Users;