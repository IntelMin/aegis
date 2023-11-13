import React, { useState } from 'react';

const TreeNode = ({ node }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div>
      <div onClick={toggle} style={{ cursor: 'pointer' }}>
        {node.label}
      </div>
      {!collapsed && node.children && (
        <div style={{ paddingLeft: '15px' }}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView = ({ data }) => {
  return (
    <div>
      {data.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};

export default TreeView;