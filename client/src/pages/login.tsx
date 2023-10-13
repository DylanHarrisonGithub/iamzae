import React from "react";
import { useNavigate } from 'react-router-dom';

import HttpService from "../services/http.service";
import AuthService from "../services/auth.service";

import { ModalContext } from "../components/modal/modal";

const Login: React.FC<any> = (props: any) => {

  const [form, setForm] = React.useState<{username: string, password: string}>({username: "", password: ""});

  const updateForm = (key: string, value: string) => setForm({ ...form, [key]: value });

  const modalContext = React.useContext(ModalContext);

  const navigate = useNavigate();

  const submit = () => {
    HttpService.post<{ token: string }>('login', { username: form.username, password: form.password }).then(async res => {     

      console.log(res);
      if (!res.success) {
        modalContext.toast?.('error', 'Error occured attempting to login.');
        res.messages.forEach(m => modalContext.toast!('warning', m));
      } else {
        if (res.body?.token) {
          res.messages.forEach(m => modalContext.toast?.('success', m));
          await AuthService.storeToken(res.body.token);
          navigate('/home');
        } else {
          modalContext.toast?.('error', 'Error occured attempting to login.');
          res.messages.forEach(m => modalContext.toast?.('error', m));
        }
      }
    }).catch(err => {
      console.log(err);
      modalContext.toast?.('error', 'Unknown error occured attempting to login.');
      modalContext.toast?.('error', err.toString());
    });
  };

  return (
    <div className="py-16 fan">
      <div className="card w-96 bg-base-100 shadow-xl mx-auto mt-16 glass-light">
        <div className="card-body">
          <h2 className="card-title text-white">Login</h2>
          <div className="divider"></div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Your Username</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Username</span>
              <input type="text" placeholder="myusername" className="input input-bordered"
                value={form.username}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => updateForm('username', event.target.value)}
              />
            </label>
            <label className="label">
              <span className="label-text text-white">Your Password</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Password</span>
              <input type="password" placeholder="password" className="input input-bordered" 
                value={form.password}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => updateForm('password', event.target.value)}
              />
            </label>
            <button className="btn btn-wide mx-auto mt-8"
              disabled={!(form.username.length && form.password.length)}
              onClick={submit}
            >Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;