import React, { useState } from "react";
import ValidationService, { Schema, COMMON_REGEXES } from "../../services/validation.service";
import HttpService from "../../services/http.service";

import { ModalContext } from "../modal/modal";

type FormState = {
  reviewerName: string;
  reviewText: string;
  rating: number;
  date: string;
};

const initialFormState: FormState = {
  reviewerName: "",
  reviewText: "",
  rating: 0,
  date: new Date().toISOString().split("T")[0], // Set to the current date (YYYY-MM-DD)
};

const reviewSchema: Schema = {
  reviewerName: { type: 'string', attributes: { required: true, strLength: { minLength: 4, maxLength: 50 }}},
  reviewText: { type: COMMON_REGEXES.COMMON_WRITING, attributes: { required: true, strLength: { minLength: 4, maxLength: 500 } }}
}

const ReviewForm: React.FC<{ eventID: number }> = ({ eventID }) => {

  const firstRender = React.useRef<number>(2);
  const [touched, setTouched] = React.useState<boolean>(false);
  const [formErrors, setFormErrors] = React.useState<{ [key: string]: string[] }>({});
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const modalContext = React.useContext(ModalContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(initialFormState);

    firstRender.current = 2;
    setTouched(false);

    const { reviewerName, reviewText, rating, date } = formData;

    const res = await HttpService.post<void>('reviewcreate', { event: eventID, name: reviewerName, stars: rating, text: reviewText });
    modalContext.toast!(res.success ? 'success' : 'error', res.messages[0]);

  };

  React.useEffect(() => {

    (async () => {
      let vErrors = (await ValidationService.validate(formData, reviewSchema)).body;
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

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date());

  return (
    <div className="container mx-auto mt-4p-4">
      <form className="max-w-md mx-auto text-black" onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            placeholder="Enter Name"
            type="text"
            id="reviewerName"
            name="reviewerName"
            value={formData.reviewerName}
            onChange={handleInputChange}
            className={`border rounded w-full py-2 px-3 ${touched && (Object.keys(formErrors).includes('reviewerName') ? 'border-red-500' : 'border-green-500')}`}
            required
          />
        </div>

        <div className="mb-4 flex px-2">
          <div id="rating" className="block">
            {[1, 2, 3, 4, 5].map((index) => (
              <span
                key={index}
                className={`text-2xl cursor-pointer ${index <= formData.rating ? "text-yellow-500" : "text-gray-400"}`}
                onClick={() => handleStarClick(index)}
              >
                &#9733;
              </span>
            ))}
          </div>
          <p className="text-gray-500 mt-2 ml-auto">{formattedDate}</p>
        </div>

        <div className="mb-4">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reviewText">
            Review Text
          </label> */}
          <textarea
            id="reviewText"
            name="reviewText"
            value={formData.reviewText}
            onChange={handleInputChange}
            className={`border rounded w-full py-2 px-3 h-32 resize-none ${touched && (Object.keys(formErrors).includes('reviewText') ? 'border-red-500' : 'border-green-500')}`}
            placeholder="Write your review here.."
            required
          />
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
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
