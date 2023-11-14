import React from "react";
import ReactQuill from "react-quill";

import Updates from "../../components/admin/updates/updates";

const AdminNews: React.FC<any> = (props: any) => {

  const [media, setMedia] = React.useState<string[]>([]);
  const [quill, setQuill] = React.useState<string>('');

  return (
    <div className="py-16 px-4 mx-auto bubbles">
      <h1 className="text-xl gold-text text-center align-middle inline-block ml-2 md:ml-8 mt-16">
        &nbsp;&nbsp;Admin News&nbsp;&nbsp;
      </h1>
      <div className="text-center p-8 m-8 bg-slate-400 bg-opacity-90 rounded-lg">


      <ReactQuill 
          theme='snow' 
          value={quill} 
          onChange={setQuill}
          modules={{  
            toolbar: {  
              container: [  
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  
                ['bold', 'italic', 'underline'],  
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],  
                [{ 'align': [] }],  
                ['link', 'image'],
                ['clean'],
                [{ 'color': [] }]  
              ],  

            }
          }}  
        />
              <Updates mediaList={media} />


      </div>
    </div>
  )
}

export default AdminNews;