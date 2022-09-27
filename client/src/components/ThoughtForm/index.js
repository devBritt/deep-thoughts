import React, { useState } from 'react';

const ThoughtForm = () => {
    // keep track of entered text and character count
    const [thoughtText, setText] = useState('');
    const [characterCount, setCharCount] = useState(0);

    // function to handle textarea value changes
    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharCount(event.target.value.length);
        }
    }

    const handleFormSubmit = async event => {
        event.preventDefault();
        setText('');
        setCharCount(0);
    }

    return (
        <div>
            <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}'`}>
                Character Count: {characterCount}/280
            </p>
            <form className='flex-row justify-center justify-space-between-md align-stretch' onSubmit={handleFormSubmit}>
                <textarea
                    placeholder="Here's a new thought..."
                    value={thoughtText}
                    className='form-input col-12 col-md-9'
                    onChange={handleChange}
                ></textarea>
                <button className='btn col-12 col-md-3' type='submit'>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ThoughtForm;
