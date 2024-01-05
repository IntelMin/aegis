import React, { useState } from 'react';

// Helper function to format the node label
const formatLabel = (node) => {
    let label = node.name;
    if (node.type === 'contract') {
        label += ' (Contract)';
    } else if (node.type === 'func') {
        label += ` ${node.spec}`;
    }
    return label;
};

const TreeNode = ({ node, onLineSelect }) => {
    const [collapsed, setCollapsed] = useState(false);
    const hasChildren = node.functions && node.functions.length > 0;

    const handleNodeClick = () => {
        setCollapsed(!collapsed);
        if (node.line !== undefined) {
            onLineSelect(node.line); 
        }
    };

    return (
        <div>
            <div
                onClick={handleNodeClick}
                style={{ cursor: 'pointer' }}
                className='mb-2 text-sm font-regular'
            >
                {hasChildren ? (collapsed ? '▶' : '▼') : '└'} {formatLabel(node)}
            </div>
            {!collapsed && hasChildren && (
                <div style={{ paddingLeft: '15px' }}>
                    {node.functions.map((func, index) => (
                        <div key={index}>
                            {/* Pass the onLineSelect prop to the recursive TreeNode call */}
                            <TreeNode node={func} onLineSelect={onLineSelect} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const TreeView = ({ data, onLineSelect }) => {
    return (
        <div>
            {data.map((contract, index) => (
                <TreeNode key={contract.name + index} node={contract} onLineSelect={onLineSelect} />
            ))}
        </div>
    );
};

export default TreeView;
