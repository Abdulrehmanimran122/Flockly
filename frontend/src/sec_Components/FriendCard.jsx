import React, { useState } from 'react';
import { LANGUAGE_TO_FLAG } from '../Constants';
import { Link } from 'react-router-dom';

const FriendCard = ({ friend }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className='card bg-base-300 hover:shadow-md transition-shadow'>
      <div className='card-body p-2'>
        {/* User INFO */}
        <div className='flex items-center gap-3 mb-3'>
          <div className='avatar size-12 cursor-pointer' onClick={toggleDetails}>
            <img 
              src={friend.profilePic} 
              className='rounded-full' 
              alt={friend.fullName} 
            />
          </div>
          <h3 className='font-semibold truncate'>{friend.fullName}</h3>
        </div>

        {/* User Details Modal */}
        {showDetails && (
          <div className="modal modal-open">
            <div className="modal-box">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">User Details</h3>
                <button 
                  className="btn btn-sm btn-circle"
                  onClick={toggleDetails}
                >
                  ✕
                </button>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <div className="avatar size-24">
                  <img 
                    src={friend.profilePic} 
                    className="rounded-full" 
                    alt={friend.fullName} 
                  />
                </div>
                
                <div className="text-center">
                  <h4 className="text-xl font-semibold">{friend.fullName}</h4>
                  {friend.email && (
                    <p className="text-gray-600 mt-1">{friend.email}</p>
                  )}
                </div>
                
              </div>
              
              <div className="modal-action">
                <button 
                  className="btn btn-primary"
                  onClick={toggleDetails}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='flex flex-wrap gap-1.5 mb-3'>
          <span className='badge badge-secondary text-xs capitalize font-semibold'>
            {getLanguageFlag(friend.nativeLanguage)}
            Native : {friend.nativeLanguage}
          </span>

          <span className='badge badge-secondary text-xs capitalize font-semibold'>
            {getLanguageFlag(friend.learningLanguage)}
            learning : {friend.learningLanguage}
          </span>
        </div>
        
        <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${countryCode}`}
        className='h-3 mr-1 inline-block'
      />
    );
  }
  return null;
}