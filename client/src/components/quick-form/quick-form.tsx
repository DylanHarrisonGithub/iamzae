import React, { HTMLInputTypeAttribute, InputHTMLAttributes, ReactElement } from 'react';

import ValidationService, { Schema, Model } from '../../services/validation.service';

import { acceptedMediaExtensions } from '../../models/models';

export type QuickFormSchemaMetaType = {
  [key: string]: any,
  quickForm?: {
    textArea?: boolean, textAreaColumns?: number, textAreaRows?: number,
    label?: string,
    placeholder?: string,
    hideErrorMessages?: boolean,
    CustomInput?: React.FC<InputHTMLAttributes<any> & React.ClassAttributes<any>>
    customInputProps?: any,
    containerClassName?: string,  // should these classnames be props of quickform instead?
    labelClassName?: string,
    inputClassName?: string,
    errrorClassName?: string,
  }
}

type Props<T=Model> = {
  schema: Schema<QuickFormSchemaMetaType>,
  onInput: (errors: string[], model: T) => void,
  labelPlacement?: "left" | "above" | "none",
  _parentKey?: string
};

const QuickForm = <T=Model>({schema, onInput, labelPlacement="above", _parentKey}: Props<T>): ReactElement => {

  const [model, setModel] = React.useState<Model>(ValidationService.instantiateSchema(schema));
  const [errors, setErrors] = React.useState<{ [key: string]: string[] }>({});
  const refs = React.useRef<{[key:string]: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null}>({}); //Object.keys(schema).reduce((refObj, key) => ({...refObj, [key]: React.useRef(null)}), {});

  React.useEffect(() => {
    (async () => {
      let vErrors = (await ValidationService.validate(model, schema)).body;
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
      setErrors(errorObj);
      onInput(vErrors!, model as T);
    })();
  }, [model]);

  React.useEffect(() => {
    setModel(ValidationService.instantiateSchema(schema));
  }, [schema]);

  const renderLeaf: (...args: any[]) => React.ReactNode = (
    model: Model, 
    schema: Schema<QuickFormSchemaMetaType>, 
    key: string,
    i?: number
  ) => {

    if (schema[key].meta?.quickForm?.CustomInput) {
      let Generic = schema[key].meta!.quickForm!.CustomInput!;
      return (
        <Generic 
          // ref={element => refs.current[key] = element}
          className={
            (Object.keys(errors).includes(key) ? 'textarea-error ' : "textarea-success ") +
            (schema[key].meta?.quickForm?.inputClassName || "w-full")
          }
          placeholder={schema[key].meta?.quickForm?.placeholder || key}
          name={typeof i === 'undefined' ? key : key + i}
          value={typeof i === 'undefined' ? model[key] as string : (model[key] as Array<string>)[i] as string}
          onChange={
            (e: React.ChangeEvent<any>) => setModel(m => 
              typeof i === 'undefined' ?
                ({...m, [key]: e.target.value})
              :
                ({...m, [key]: (model[key] as Array<any>).map((element,j) => j === i ? e.target.value : element)})
            ) 
          }
          { ...schema[key].meta?.quickForm?.customInputProps }
        />
      );
    }

    if (
      (typeof schema[key].type === 'string' &&
      (schema[key].type as string).includes('string')) ||
      (schema[key].type instanceof RegExp)
    ) {
      if (schema[key].meta?.quickForm?.textArea === true) {
        return (
          <textarea
            ref={element => refs.current[key] = element}
            className={
              (Object.keys(errors).includes(key) ? 'textarea-error ' : "textarea-success ") +
              (schema[key].meta?.quickForm?.inputClassName || "textarea textarea-bordered resize-none w-full")
            }
            placeholder={schema[key].meta?.quickForm?.placeholder || key}
            rows={schema[key].meta?.quickForm?.textAreaRows || 4}
            name={typeof i === 'undefined' ? key : key + i}
            value={typeof i === 'undefined' ? model[key] as string : (model[key] as Array<string>)[i] as string}
            onChange={
              (e: React.ChangeEvent<HTMLTextAreaElement>) => setModel(m => 
                typeof i === 'undefined' ?
                  ({...m, [key]: e.target.value})
                :
                  ({...m, [key]: (model[key] as Array<any>).map((element,j) => j === i ? e.target.value : element)})
              ) 
            }
          />
        );
      }
      return (  
        <input
          ref={element => refs.current[key] = element}
          className={
            (Object.keys(errors).includes(key) ? 'input-error ' : "input-success ") +
            (schema[key].meta?.quickForm?.inputClassName || "input input-bordered w-full")
          }
          type="text"
          placeholder={schema[key].meta?.quickForm?.placeholder || key}
          name={typeof i === 'undefined' ? key : key + i}
          value={typeof i === 'undefined' ? model[key] as string : (model[key] as Array<string>)[i] as string}
          onChange={
            (e: React.ChangeEvent<HTMLInputElement>) => setModel(m => 
              typeof i === 'undefined' ?
                ({...m, [key]: e.target.value})
              :
                ({...m, [key]: (model[key] as Array<any>).map((element,j) => j === i ? e.target.value : element)})
            ) 
          }
        />
      );
    } else if (
      (typeof schema[key].type === 'string' &&
      (schema[key].type as string).includes('number'))
    ) {
      return (
        <input
          ref={element => refs.current[key] = element}
          className={
            (Object.keys(errors).includes(key) ? 'input-error ' : "input-success ") +
            (schema[key].meta?.quickForm?.inputClassName || "input input-bordered w-full")
          }
          type="text"
          pattern='[0-9.,]+'
          placeholder={schema[key].meta?.quickForm?.placeholder || key}
          name={typeof i === 'undefined' ? key : key + i}
          value={typeof i === 'undefined' ? model[key] as string : (model[key] as Array<string>)[i] as string}
          onChange={ 
            (e: React.ChangeEvent<HTMLInputElement>) => setModel(m => 
              typeof i === 'undefined' ?
                ({...m, [key]: parseFloat(e.target.value) || ''})
              :
                ({...m, [key]: (model[key] as Array<any>).map((element,j) => j === i ? (parseFloat(e.target.value) || '') : element)})
            ) 
          }
        />
      );
    } else if (
      (typeof schema[key].type === 'string' &&
      (schema[key].type as string).includes('boolean'))
    ) {
      return (
        <div className='flex items-center'>
          { // checkbox label omission is not allowed
            (labelPlacement !== "left") && (
              <label
                className={

                  (schema[key].meta?.quickForm?.labelClassName || "pr-4")
                }
              >
                { schema[key].meta?.quickForm?.placeholder || key }
              </label>
            )
          }
          <input
            ref={element => refs.current[key] = element}
            className={
              (Object.keys(errors).includes(key) ? 'checkbox-error ' : "checkbox-success ") +
              (schema[key].meta?.quickForm?.inputClassName || "checkbox")
            }
            type="checkbox"
            name={typeof i === 'undefined' ? key : key + i}
            checked={typeof i === 'undefined' ? model[key] as boolean : (model[key] as Array<boolean>)[i] as boolean}
            onChange={ 
              (e: React.ChangeEvent<HTMLInputElement>) => setModel(m => 
                typeof i === 'undefined' ? 
                  ({...m, [key]: !model[key] })
                :
                  ({...m, [key]: (model[key] as Array<any>).map((element,j) => j === i ? !element : element)})
              ) 
            }
          />
        </div>
      );
    } else if (Array.isArray(schema[key].type)) {
      return (
        <select
          className={
            (Object.keys(errors).includes(key) ? 'select-error ' : "select-success ") +
            (schema[key].meta?.quickForm?.inputClassName || "select select-bordered w-full invalid:text-gray-500")
          }
          ref={element => refs.current[key] = element}
          //value={typeof i === 'undefined' ? model[key] as string : (model[key] as Array<string>)[i] as string}
          defaultValue={key}
          name={typeof i === 'undefined' ? key : key + i}
          onChange={ 
            (e: React.ChangeEvent<HTMLSelectElement>) => setModel(m => 
              typeof i === 'undefined' ? 
                ({...m, [key]: e.target.value})
              :
                ({...m, [key]: (model[key] as Array<any>).map((element,j) => j === i ? e.target.value : element)})
            ) 
          }
        >
          {
            [
              (<option key={'default' + key} value={key} disabled={true}>{schema[key].meta?.quickForm?.placeholder || key}</option>),
              ...((schema[key].type as string[]).map((option, i) => <option key={key + option + i} value={option}>{option}</option>))
            ]
          }
        </select>
      );
    }
    return <span>form error</span>; //should be unreacheable
  }

  return (
    <table className={"table-auto w-full"}>
      {
        Object.keys(model).map((key: string): React.ReactNode => {
          if (Array.isArray(model[key])) {
            if (typeof (model[key] as Array<any>)[0] === 'object') {
              return (
                <tbody 
                  key={(_parentKey || "") + key} 
                  className={schema[key].meta?.quickForm?.containerClassName || ""}
                >
                  <tr key={(_parentKey || "") + key + "label"}>
                    <td className='align-top'>
                      {
                        (labelPlacement === "left") && (
                          <label
                            className={schema[key].meta?.quickForm?.labelClassName || "pr-4"}
                          >
                            {key}
                          </label>
                        )
                      }
                    </td>
                    <td className='w-full'>
                      {
                        (labelPlacement === "above") && (
                          <label
                            className={schema[key].meta?.quickForm?.labelClassName || "pr-4"}
                          >
                            {key}
                          </label>
                        )
                      }
                      {
                        (model[key] as Array<any>).map((f, i) => (
                          <QuickForm<Model>
                            key={(_parentKey || "") + key + i}
                            schema={schema[key].type as Schema<QuickFormSchemaMetaType>} 
                            onInput={(v, m) => setModel({...model, [key]: (model[key] as Array<any>).map((e,j) => j === i ? m : e)}) }
                            _parentKey={(_parentKey || "") + key + i + "."} 
                          />
                        ))
                      }
                    </td>
                  </tr>
                  {
                    (
                      (schema[key].attributes?.array?.maxLength === undefined) ||
                      ((model[key] as Array<any>).length < schema[key].attributes!.array!.maxLength!)
                    ) &&
                      (
                        <tr>
                          <td colSpan={2}>
                            <button
                              key={(_parentKey || "") + key + "push"}
                              className={"btn btn-primary btn-block"}
                              onClick={() => setModel(m => ({
                                ...m, 
                                [key]: [
                                  ...(model[key] as Array<any>), 
                                  schema[key].attributes?.default ? 
                                      schema[key].attributes?.default! 
                                    : 
                                      ValidationService.instantiateSchema(schema[key].type as Schema<any>)
                                ]
                              }))}
                            >
                              +
                            </button>
                          </td>
                        </tr>
                      )
                  }

                </tbody>
              );
            } else {
              return (
                <tbody key={(_parentKey || "") + key} className={schema[key].meta?.quickForm?.containerClassName || ""}>
                  <tr key={(_parentKey || "") + key + "label"} className=''>
                    <td className='align-top'>
                      {
                        (labelPlacement === "left") && (
                          <label
                            className={schema[key].meta?.quickForm?.labelClassName || "pr-4"}
                          >
                            {key}
                          </label>
                        )
                      }
                    </td>
                    <td className='w-full'>
                      {
                        (labelPlacement === "above") && (
                          <label
                            className={schema[key].meta?.quickForm?.labelClassName || "pr-4"}
                          >
                            {key}
                          </label>
                        )
                      }
                      <table className='table-auto w-full'>
                        <tbody className=""> {/* figure out how this is supposed to be styled */}
                          {
                            (model[key] as Array<any>).map((f, i) => (
                              <tr key={(_parentKey || "") + key + i.toString()} className="">
                                <td><label className={schema[key].meta?.quickForm?.labelClassName || "pr-4"}>{i}</label></td>
                                <td className='w-full'>
                                  {/* <input
                                    className={schema[key].attributes?.meta?.quickForm?.inputClassName || "ml-3 input input-bordered"}
                                    type="text"
                                    name={key+i}
                                    value={f.toString()}
                                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setModel(m => ({...m, [key]: (model[key] as Array<any>).map((element,j) => j === i ? e.target.value : element)})) }
                                  /> */}
                                  { renderLeaf(model, schema, key, i) }
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {
                    ((schema[key].attributes?.array?.maxLength === undefined) ||
                    ((model[key] as Array<any>).length < schema[key].attributes!.array!.maxLength!)) &&
                      <tr>
                        <td colSpan={2} >
                          <button
                            key={(_parentKey || "") + key + "push"}
                            className={"btn btn-primary btn-block"}
                            onClick={() => setModel(m => ({...m, [key]: [...(model[key] as Array<any>), schema[key].attributes?.default ? schema[key].attributes?.default! : ""]}))}
                          >
                            +
                          </button>
                        </td>
                      </tr>
                  }
                </tbody>
              );
            }
          } else {
            if (typeof model[key] === 'object') {
              return (
                <tbody key={(_parentKey || "") + key} className={schema[key].meta?.quickForm?.containerClassName || ""}>
                  <tr>
                    <td className='align-top'>
                      {
                        (labelPlacement === "left") && (
                          <label
                            className={schema[key].meta?.quickForm?.labelClassName || "pr-4"}
                          >
                            {key}
                          </label>
                        )
                      }
                    </td>
                    <td className='w-full'>
                      {
                        (labelPlacement === "above") && (
                          <label
                            className={schema[key].meta?.quickForm?.labelClassName || "pr-4"}
                          >
                            {key}
                          </label>
                        )
                      }
                      <QuickForm<Model>
                        schema={schema[key].type as Schema<QuickFormSchemaMetaType>} 
                        onInput={ (v, m) => setModel({...model, [key]: m}) }
                        _parentKey={(_parentKey || "") + key + "."}
                      />
                    </td>
                  </tr>
                </tbody>
              );
            } else {
              return (
                <tbody key={(_parentKey || "") + key} className={schema[key].meta?.quickForm?.containerClassName || ""}>
                  <tr
                    className={schema[key].meta?.quickForm?.containerClassName || ""}
                  >
                    <td className='align-top'>
                      {
                        (labelPlacement === "left") && (
                          <label
                            className={schema[key].meta?.quickForm?.labelClassName || "pr-4"}
                          >
                            {key}
                          </label>
                        )
                      }
                    </td>
                    <td className='w-full text-left'>
                      {
                        (labelPlacement === "above") && (
                          <label
                            className={schema[key].meta?.quickForm?.labelClassName || "p-2"}
                          >
                            {key}
                          </label>
                        )
                      }
                      { renderLeaf(model, schema, key) }
                    </td>
                  </tr>
                  {
                    (!(schema[key].meta?.quickForm?.hideErrorMessages) && Object.keys(errors).includes(key) && (document.activeElement === refs.current[key])) && ( // only show errors for active element to keep form cleaner
                      <tr>
                        <td colSpan={2}>
                          <table className='w-full'>
                            <tbody>
                              {
                                errors[key].length &&
                                // display fails if message is too long
                                errors[key].map((e, i) => (
                                  <tr key={e+i.toString()}>
                                    <td colSpan={2}><p  className={
                                      schema[key].meta?.quickForm?.errrorClassName || 'alert alert-error text-sm'
                                    }>{e}</p></td> 
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              );
            }
          }
        })
      }
    </table>
  )
};

export default QuickForm;
