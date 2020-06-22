import React from 'react';
import livingLab from './livinglab.png'
import banksa from './banksa.png'
import dspark from './dspark.png'

const Footer = () => {
    const footerStyle = {
        display: 'flex',
        flexDirection: 'row',
        width: '35%',
        float: 'right',
    };
    const logoStyle = {
        width: '20%',
        margin: 'auto',
    }
    return (
        <div className='footer' style = {footerStyle}>
            <img style = {logoStyle} src={banksa} alt = {''}></img>
            <img style = {logoStyle} src={livingLab} alt = {''}></img>
            <img style = {logoStyle} src={dspark} alt = {''}></img>
        </div>
    )
}
export default Footer;