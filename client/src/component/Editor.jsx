/* eslint-disable react-hooks/exhaustive-deps */
import { useRef,useEffect } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";

// eslint-disable-next-line react/prop-types
const Editor = ({socketRef,roomId,onCodeChange}) => {
    // eslint-disable-next-line no-unused-vars
    const editorRef=useRef(null);
    

    useEffect(()=>{
        const init=async()=>{
                         const editor=CodeMirror.fromTextArea(
                         document.getElementById("realTimeEditor"),
                            {
                                mode:{name:"javascript",json:true},
                                theme:"dracula",
                                autoCloseTags:true,
                                autoCloseBrackets:true,
                                lineNumbers:true,
                            }


                         );
                         editorRef.current=editor;
                         editor.setSize(null,'100%')
                      editor.on('change',(instance,changes)=>{
                         const {origin}=changes;
                         const code=instance.getValue();      // code that is being getting written on the code-mirror
                            
                         onCodeChange(code)
                         
                         if(origin!=="setValue")
                          {
                            // eslint-disable-next-line react/prop-types
                            socketRef.current.emit("code-change",{
                              roomId,
                              code,
                            });
                          }
                      
                          })
                        
                          // eslint-disable-next-line react/prop-types
                         

                        }
                        init();
    },)
    useEffect(()=>{
      // eslint-disable-next-line react/prop-types
      if(socketRef.current)
      {
        // eslint-disable-next-line react/prop-types
        socketRef.current.on('code-change',({code})=>{
          if(code!=null)
          {
            editorRef.current.setValue(code);
          }
        })
      }
      return ()=>{
        socketRef.current.off("code-change");
      }
    // eslint-disable-next-line react/prop-types
    },[socketRef.current])

  return (
    <div style={{height:"600%"}}>
        <textarea id="realTimeEditor"></textarea>
                      
    </div>
  )
}

export default Editor

