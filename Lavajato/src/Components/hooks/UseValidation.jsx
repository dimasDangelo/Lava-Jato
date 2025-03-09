import React, { Fragment } from "react";

const UseValidation = () => {

    const verifyRequiredField = (fields) => {
        let inputError = {};
        fields.forEach((input) => {
            if(
                input?.value === null ||
                input?.value === undefined ||
                input?.value.toString().trim() ===  '' ||
                input?.value === 'error' 
            ){
            inputError = {...inputError, [input.label]: true}
            }
        });
        return inputError;
    }
    const requiredFild = (input, msg = '') => {
        if (input) {
        return (
            <Fragment>
                {' '}
                <span style={{ color: "red", fontSize: '10px' }}>
                    {msg === '' ? 'Campo Obrigatório!' : msg}
                </span>{' '}
            </Fragment>
        )
    }
    }
    return {
        verifyRequiredField,
        requiredFild
    }
}
export default UseValidation;