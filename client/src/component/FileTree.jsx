import React from 'react'
import { Link } from 'react-router-dom'

const FileTreeNode =({ fileName, nodes }) =>{
    const isDirectory = nodes !== null;
    
    return(
        <div style={{ marginLeft: "10px" }}>
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "2px 0",
                color: isDirectory ? "#569cd6" : "#d4d4d4",
                cursor: "pointer"
            }}>
                {isDirectory ? (
                    <>
                        <span style={{ marginRight: "5px" }}>📁</span>
                        <span>{fileName}</span>
                    </>
                ) : (
                    <>
                        <span style={{ marginRight: "5px" }}>📄</span>
                        <span>{fileName}</span>
                    </>
                )}
            </div>
            {isDirectory && (
                <ul style={{ listStyle: "none", paddingLeft: "0", marginLeft: "15px" }}>  
                    {Object.keys(nodes).map((child) => (
                        <li key={child}>
                             <FileTreeNode fileName={child} nodes={nodes[child]} />
                        </li>
                   ))}
                </ul>
            )}
        </div>
    )
}

const FileTree = ({ tree }) => {
  return (
    <div style={{ padding: "10px" }}>
      <ul style={{ listStyle: "none", paddingLeft: "0" }}>  
        {tree && Object.keys(tree).map((child) => (
          <li key={child}>
            <FileTreeNode fileName={child} nodes={tree[child]} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FileTree;