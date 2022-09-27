import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
    // keep track of entered text and character count
    const [thoughtText, setText] = useState('');
    const [characterCount, setCharCount] = useState(0);

    // destructure addThought function from ADD_THOUGHT
    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        update(cache, { data: { addThought } }) {
            // cache could potentially not exist yet, so wrap in a try/catch
            try {
                // update "me" array's cache
                const { me } = cache.readQuery({ query: QUERY_ME });
                cache.writeQuery({
                    query: QUERY_ME,
                    data: { me: { ...me, thoughts: [...me.thoughts, addThought] } }
                });
            } catch (error) {
                console.warn("First thought insertion by user!");
            }

            // cache could potentially not exist yet, so wrap in a try/catch
            try {
                // update thought array's cache
                const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
                cache.writeQuery({
                    query: QUERY_THOUGHTS,
                    data: { thoughts: [addThought, ...thoughts] }
                });
            } catch (error) {
                console.warn("Updating global thought list...");
            }
        }
    });

    // function to handle textarea value changes
    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharCount(event.target.value.length);
        }
    }

    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            // add thought to db
            await addThought({
                variables: { thoughtText }
            });

            // clear form
            setText('');
            setCharCount(0);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {error && <span className='ml-2'>Something went wrong...</span>}
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
