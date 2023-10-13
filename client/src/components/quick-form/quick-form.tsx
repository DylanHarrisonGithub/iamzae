import React, { ReactElement } from 'react';

import ValidationService, { Schema, Model } from '../../services/validation.service';

export type QuickFormSchemaMetaType = {
  [key: string]: any,
  quickForm?: {
    containerClassName?: string,
    labelClassName?: string,
    inputClassName?: string
  }
}

type Props<T=Model> = {
  schema: Schema<QuickFormSchemaMetaType>,
  onInput: (errors: string[], model: T) => void,
  _parentKey?: string
};

const QuickForm = <T=Model>({schema, onInput, _parentKey}: Props<T>): ReactElement => {

  const [model, setModel] = React.useState<Model>(ValidationService.instantiateSchema(schema));
  const [errors, setErrors] = React.useState<{ [key: string]: string[] }>({});
  const refs = React.useRef<{[key:string]: HTMLInputElement | HTMLSelectElement | null}>({}); //Object.keys(schema).reduce((refObj, key) => ({...refObj, [key]: React.useRef(null)}), {});

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

  const renderLeaf: (...args: any[]) => React.ReactNode = (
    model: Model, 
    schema: Schema<QuickFormSchemaMetaType>, 
    key: string,
    i?: number
  ) => {
    if (
      (typeof schema[key].type === 'string' &&
      (schema[key].type as string).includes('string')) ||
      (schema[key].type instanceof RegExp)
    ) {
      return (
        <input
          ref={element => refs.current[key] = element}
          className={
            (Object.keys(errors).includes(key) ? 'input-error ' : "input-success ") +
            (schema[key].attributes?.meta?.quickForm?.inputClassName || "ml-3 input input-bordered")
          }
          type="text"
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
          className={schema[key].attributes?.meta?.quickForm?.inputClassName || "ml-3 input input-bordered"}
          type="number"
          name={typeof i === 'undefined' ? key : key + i}
          value={typeof i === 'undefined' ? model[key] as string : (model[key] as Array<string>)[i] as string}
          onChange={ 
            (e: React.ChangeEvent<HTMLInputElement>) => setModel(m => 
              typeof i === 'undefined' ?
                ({...m, [key]: parseFloat(e.target.value)})
              :
                ({...m, [key]: (model[key] as Array<any>).map((element,j) => j === i ? parseFloat(e.target.value) : element)})
            ) 
          }
        />
      );
    } else if (
      (typeof schema[key].type === 'string' &&
      (schema[key].type as string).includes('boolean'))
    ) {
      return (
        <input
          ref={element => refs.current[key] = element}
          className={schema[key].attributes?.meta?.quickForm?.inputClassName || "ml-3 input input-bordered"}
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
      );
    } else if (Array.isArray(schema[key].type)) {
      return (
        <select
          ref={element => refs.current[key] = element}
          value={typeof i === 'undefined' ? model[key] as string : (model[key] as Array<string>)[i] as string}
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
            ((schema[key].type as string[]).map(option => <option value={option}>{option}</option>))
          }
        </select>
      );
    }
    return <span>form error</span>; //should be unreacheable
  }

  return (
    <table className={"table-auto"}>
      {
        Object.keys(model).map((key: string): React.ReactNode => {
          if (Array.isArray(model[key])) {
            if (typeof (model[key] as Array<any>)[0] === 'object') {
              return (
                <tbody 
                  key={(_parentKey || "") + key} 
                  className={schema[key].attributes?.meta?.quickForm?.containerClassName || "border-solid border-2 rounded"}
                >
                  <tr key={(_parentKey || "") + key + "label"}>
                    <td>
                      <label
                        className={schema[key].attributes?.meta?.quickForm?.labelClassName || ""}
                      >
                        {key}
                      </label>
                    </td>
                    <td>
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
                <tbody key={(_parentKey || "") + key} className={schema[key].attributes?.meta?.quickForm?.containerClassName || "border-solid border-2 rounded"}>
                  <tr key={(_parentKey || "") + key + "label"}>
                    <td><label>{key}</label></td>
                    <td>
                      <table className='table-auto'>
                        <tbody className="border-solid border2 rounded">
                          {
                            (model[key] as Array<any>).map((f, i) => (
                              <tr key={(_parentKey || "") + key + i.toString()} className="ml-3">
                                <td><label className={schema[key].attributes?.meta?.quickForm?.labelClassName || ""}>{i}</label></td>
                                <td>
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
                <tbody key={(_parentKey || "") + key} className={schema[key].attributes?.meta?.quickForm?.containerClassName || "border-solid border-2 rounded"}>
                  <tr>
                    <td><label >{key}</label></td>
                    <td>
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
                <tbody key={(_parentKey || "") + key} className={schema[key].attributes?.meta?.quickForm?.containerClassName || "border-solid border-2 rounded"}>
                  <tr
                    className={schema[key].attributes?.meta?.quickForm?.containerClassName || ""}
                  >
                    <td><label className={schema[key].attributes?.meta?.quickForm?.labelClassName || ""}>{key}</label></td>
                    <td>{ renderLeaf(model, schema, key) }</td>
                  </tr>
                  {
                    (Object.keys(errors).includes(key) && (document.activeElement === refs.current[key])) && ( // only show errors for active element to keep form cleaner
                      <tr>
                        <td colSpan={2}>
                          <table className='w-full'>
                            <tbody>
                            {
                              // display fails if message is too long
                              errors[key].map(e => (
                                <tr>
                                  <td colSpan={2}><p  className='alert alert-error text-sm'>{e}</p></td> 
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
