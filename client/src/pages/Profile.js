import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';
import Auth from '../utils/auth';

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

const Profile = () => {
    // destructure addFriend mutation function from ADD_FRIEND
    const [addFriend] = useMutation(ADD_FRIEND);

    // destructure username from url params
    const { username: userParam } = useParams();

    // check if username param exists; if it does, QUERY_USER, otherwise QUERY_ME (logged in user)
    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam }
    });

    // extract user data
    const user = data?.me || data?.user || {};

    // NOTE: this can be used to add animated loaders
    if (loading) {
        return <div>Loading...</div>
    }

    // check if username url param is the logged in user's
    if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
        return <Navigate to="/profile" />;
    }

    // alert user trying to view personal profile while logged out
    if (!user?.username) {
        return (
            <h4>
                You need to be logged in to see this page. Use the navigation links above to sign up or log in!
            </h4>
        );
    }

    // add friend to friends list on button click
    const handleClick = async () => {
        try {
            await addFriend({
                variables: { id: user._id }
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="flex-row mb-3">
                <h2 className="bg-dark text-secondary p-3 display-inline-block">
                    Viewing {userParam ? `${user.username}'s` : 'your'} profile.
                </h2>

                {userParam && (
                    <button className='btn ml-auto' onClick={handleClick}>
                        Add Friend
                    </button>
                )}
            </div>

            <div className="flex-row justify-space-between mb-3">
                <div className="col-12 mb-3 col-lg-8"><ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} /></div>

                <div className="col-12 col-lg-3 mb-3">
                    <FriendList
                        username={user.username}
                        friendCount={user.friendCount}
                        friends={user.friends}
                    />
                </div>
            </div>
        </div>
    );
};

export default Profile;
