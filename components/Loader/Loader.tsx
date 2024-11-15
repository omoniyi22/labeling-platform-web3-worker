import React from 'react';
import { Oval } from 'react-loader-spinner';

interface LoaderModalProps {
    isVisible: boolean;
}

const LoaderModal: React.FC<LoaderModalProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <Oval                
                    visible={true}
                    height={25}
                    width={25}
                    color="#111827"
                    ariaLabel="oval-loading"
                />
            </div>
        </div>
    );
};

// Styles
const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure it's above other content
};

const modalContentStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '47%',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

export default LoaderModal;
