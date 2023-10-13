import React from "react";
import { useNavigate } from 'react-router-dom';

import ValidationService, { Schema, COMMON_REGEXES } from "../services/validation.service";
import HttpService from "../services/http.service";

import AuthService from "../services/auth.service";

import { ModalContext } from "../components/modal/modal";

const userSchema = {
  username: {
    required: true,
    type: 'string',
    minLength: 8,
    isusername: true
  },
  password: {
    required: true,
    type: 'string',
    minLength: 8,
    isPassword: true
  }
}

const userSchema2: Schema = {
  username: {
    type: "string",
    attributes: {
      required: true,
      strLength: { minLength: 8, maxLength: 40 }
    }
  },
  password: {
    type: COMMON_REGEXES.PASSWORD_STRONGEST,
    attributes: {
      required: true,
      strLength: { minLength: 8, maxLength: 40 }
    }
  },
  password2: {
    type: "string",
    attributes: {
      required: true,
      tests: [
        ((root, input) => {
          let t = root.password === input;
          if (t) {
            return { success: true } 
          } else {
            return { success: false, message: ` Passwords do not match!`}
          }
        })
      ]
    }
  }
};

const Register: React.FC<any> = (props: any) => {

  const [form, setForm] = React.useState<{username: string, password: string, password2: string}>({username: "", password: "", password2: ""});
  const [errors, setErrors] = React.useState<{username?: string[], password?: string[], password2?: string[]}>({});

  const modalContext = React.useContext(ModalContext);
  const navigate = useNavigate();

  const updateForm = (key: string, value: string) => setForm({ ...form, [key]: value });

  React.useEffect(() => {
    // useeffect function can't be directly async??
    (async () => {
      const errs = (await ValidationService.validate({ username: form.username, password: form.password, password2: form.password2 }, userSchema2)).body;
      const usernameErrs = errs?.filter(e => e.includes('username'));
      const passwordErrs = errs?.filter(e => (e.includes('password') && !(e.includes('password2'))));
      const password2Errs = errs?.filter(e => e.includes(`Passwords do not match!`)).map(e => e.replace('password2', ''));
      // const password2Errs = form.password === form.password2 ? [] : ['passwords do not match'];
      setErrors({
        username: form.username.length > 0 ? usernameErrs : undefined,
        password: form.password.length > 0 ? passwordErrs : undefined,
        password2: (form.password2.length > 0 || form.password.length > 0) ? password2Errs : undefined
      });
    })();

  }, [form]);

  const submit = () => {
    HttpService.post<{ token: string }>('register', { username: form.username, password: form.password }).then(async res => {     
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
          <h2 className="card-title text-white">Register</h2>
          <div className="divider"></div>
          <div className="form-control">

            <label className="label">
              <span className="label-text text-white">Your Username</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Username</span>
              <input 
                type="text" placeholder="myusername" className="input input-bordered" value={form.username}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => updateForm('username', event.target.value)}
              />
              {
                (errors.username && errors.username.length > 0) && 
                <ul className="alert-error shadow-lg list-disc list-inside">
                  {
                    errors.username.map((e, i) => <li className="pl-4" key={i}>{e}</li>)
                  }
                </ul>
              }
            </label>

            <label className="label">
              <span className="label-text text-white">Your Password</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Password</span>
              <input 
                type="password" placeholder="password" className="input input-bordered" value={form.password}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => updateForm('password', event.target.value)}
              />
              {
                (errors.password && errors.password.length > 0) && 
                <ul className="alert-error shadow-lg list-disc list-inside">
                  {
                    errors.password.map((e, i) => <li className="pl-4" key={i}>{e}</li>)
                  }
                </ul>
              }
            </label>

            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Password</span>
              <input 
                type="password" placeholder="password" className="input input-bordered" value={form.password2}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => updateForm('password2', event.target.value)}
              />
              {
                (errors.password2 && errors.password2.length > 0) && 
                <ul className="alert-error shadow-lg list-disc list-inside">
                  {
                    errors.password2.map((e, i) => <li className="pl-4" key={i}>{e}</li>)
                  }
                </ul>
              }
            </label>

            <button className="btn btn-wide mx-auto mt-8" 
              disabled={
                ((errors.username && !!(errors.username.length)) || !form.username.length) ||
                ((errors.password && !!(errors.password.length)) || !form.password.length) ||
                ((errors.password2 && !!(errors.password2.length)) || !form.password2.length)
              } 
              onClick={submit}
            >Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;