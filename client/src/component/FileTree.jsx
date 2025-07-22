import React from 'react'
import { Link } from 'react-router-dom'

const FileTreeNode =({ fileName, nodes, onFileSelect, currentPath = "" }) =>{
    const isDirectory = nodes !== null;
    const fullPath = currentPath ? `${currentPath}/${fileName}` : fileName;
    
    const handleClick = () => {
        if (!isDirectory) {
            onFileSelect(fullPath);
        }
    };
    
    return(
        <div style={{ marginLeft: "10px" }}>
            <div 
                style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    padding: "4px 6px",
                    color: isDirectory ? "#569cd6" : "#d4d4d4",
                    cursor: "pointer",
                    borderRadius: "3px"
                }}
                onClick={handleClick}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2d2d30"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
                {isDirectory ? (
                    <>
                        <span style={{ marginRight: "8px" }}>📁</span>
                        <span>{fileName}</span>
                    </>
                ) : (
                    <>
                        <span style={{ marginRight: "8px" }}>📄</span>
                        <span>{fileName}</span>
                    </>
                )}
            </div>
            {isDirectory && (
                <ul style={{ listStyle: "none", paddingLeft: "0", marginLeft: "15px" }}>  
                    {Object.keys(nodes).map((child) => (
                        <li key={child}>
                             <FileTreeNode 
                                fileName={child} 
                                nodes={nodes[child]} 
                                onFileSelect={onFileSelect}
                                currentPath={fullPath}
                             />
                        </li>
                   ))}
                </ul>
            )}
        </div>
    )
}

const FileTree = ({ tree, onFileSelect }) => {
  return (
    <div style={{ padding: "10px" }}>
      <div style={{ 
        color: "#cccccc", 
        fontSize: "12px", 
        marginBottom: "8px", 
        borderBottom: "1px solid #444",
        paddingBottom: "4px"
      }}>
        FILES
      </div>
      <ul style={{ listStyle: "none", paddingLeft: "0", margin: "0" }}>  
        {tree && Object.keys(tree).map((child) => (
          <li key={child}>
            <FileTreeNode 
              fileName={child} 
              nodes={tree[child]} 
              onFileSelect={onFileSelect}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FileTree;