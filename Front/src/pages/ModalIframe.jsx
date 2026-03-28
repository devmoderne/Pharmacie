
import React from 'react';

const ModalIframe = ({ show, onClose, src, title, width = '80%', height = '600px' }) => {
if (!show) return null;

return (
<div style={{
position: 'fixed',
top: 0, left: 0, right: 0, bottom: 0,
backgroundColor: 'rgba(0,0,0,0.5)',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
zIndex: 1000,
}}>
<div style={{
position: 'relative',
width: width,
maxWidth: '800px',
background: '#fff',
borderRadius: '10px',
overflow: 'hidden',
}}>
<button
onClick={onClose}
style={{
position: 'absolute',
top: 10,
right: 10,
zIndex: 10,
background: 'red',
color: 'white',
border: 'none',
borderRadius: '50%',
width: 30,
height: 30,
cursor: 'pointer'
}}
>
X </button>
<iframe
src={src}
width="100%"
height={height}
title={title}
style={{ border: 'none' }}
/> </div> </div>
);
};

export default ModalIframe;

