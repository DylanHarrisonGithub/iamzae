import React from "react";

import ValidationService, { Schema, COMMON_REGEXES } from "../services/validation.service";
import HttpService from "../services/http.service";

import { ModalContext } from "../components/modal/modal";

type FormState = {
  email: string;
  subject: string;
  message: string;
};

const initialFormState: FormState = {
  email: "",
  subject: "",
  message: ""
};

const contactSchema: Schema = {
  email: { type: COMMON_REGEXES.EMAIL, attributes: { required: true, strLength: { minLength: 4, maxLength: 50 }}},
  subject: { type: COMMON_REGEXES.ALPHA_NUMERIC_SPACES, attributes: { required: true, strLength: { minLength: 4, maxLength: 128 } }},
  message: { type: COMMON_REGEXES.COMMON_WRITING, attributes: { required: true, strLength: { minLength: 4, maxLength: 1024 } }}
}

const Contact: React.FC<any> = () => {

  const firstRender = React.useRef<number>(2);
  const [touched, setTouched] = React.useState<boolean>(false);
  const [formErrors, setFormErrors] = React.useState<{ [key: string]: string[] }>({});
  const [formData, setFormData] = React.useState<FormState>(initialFormState);

  const modalContext = React.useContext(ModalContext);

  React.useEffect(() => {

    (async () => {
      let vErrors = (await ValidationService.validate(formData, contactSchema)).body;
      let errorKeys: string[] = [];
      vErrors?.forEach(err => {
        if (!errorKeys.includes(err.split(" ")[0])) {
          errorKeys.push(err.split(" ")[0])
        }
      });
      let errorObj: { [key: string]: string[] } = {};
      errorKeys.forEach(key => {
        errorObj[key] = (vErrors?.filter(err => err.split(' ')[0] === key)!).map(err => err.split(' ').slice(1).join(' '))
      });
      setFormErrors(errorObj);
      (!touched && !firstRender.current) && setTouched(true);
      firstRender.current  && (firstRender.current -= 1);
    })();
  }, [formData]);

  const handleSubmit = async () => {
    setFormData(initialFormState);

    firstRender.current = 2;
    setTouched(false);

    const res = await HttpService.post('contactcreate', {  
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    });

    modalContext.toast!(res.success ? "success" : "error", res.messages[0]);
  };

  return (
    <div className="py-16 px-4 mx-auto hex2">
      <div className="mt-16 glass md:w-3/4 mx-auto border-2 rounded-lg p-8 shadow-2xl">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Contact Me</h2>
        <p className="mb-8 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Got a technical issue? Want to book me for a show? Need details about my availability? Let me know.</p>
        <form action="#" className="space-y-8">
          <div className="">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
            <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="your@email.com" required 
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(fd => ({ ...fd, email: e.target.value}))}
            />
          </div>
          <div>
            <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
            <input type="text" id="subject" className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Let me know how I can help you" required 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(fd => ({ ...fd, subject: e.target.value}))}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
            <textarea id="message" rows={6} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none" placeholder="Leave a comment..."
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(fd => ({ ...fd, message: e.target.value}))}
            ></textarea>
          </div>

          <div className="flex">
            {
              (touched && !!Object.keys(formErrors).length) &&
                // <div className="inline-block alert alert-error mr-2 h-12 pl-10 pt-3">{Object.keys(formErrors)[0] + ": " + formErrors[Object.keys(formErrors)[0]][0]}</div>
                <select 
                  className="inline-block alert alert-error mr-2 h-12 pt-4 text-sm overflow-hidden">
                  { // todo: focus input element corresponding to selected error
                    Object.keys(formErrors).reduce((opts, key) => [...formErrors[key].map(err => (<option className="text-xs">{key + " " + err}</option>)), ...opts],([] as React.ReactNode[]))
                  }
                </select>
            }
            <button 
              type="submit" 
              className="btn btn-primary ml-auto"
              disabled={!touched || !!Object.keys(formErrors).length}
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </div>

        </form>
      </div>

    </div>
  )
}

export default Contact;