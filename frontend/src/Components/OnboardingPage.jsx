import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast';
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, UploadIcon } from 'lucide-react';
import { completeOnboarding } from '../lib/api.js';
import { LANGUAGES } from '../Constants/index.js';
import useAuthUser from '../hooks/useAuthUser.js';

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending, error } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });


  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // Validate file type and size
  //   if (!file.type.match('image.*')) {
  //     toast.error('Please select an image file');
  //     return;
  //   }

  //   const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  //   if (file.size > MAX_SIZE) {
  //     toast.error('Image must be smaller than 2MB');
  //     return;
  //   }

  //   try {
  //     // Compress and convert to base64
  //     const compressedFile = await compressImage(file);
  //     const reader = new FileReader();

  //     reader.onload = (event) => {
  //       setFormState(prev => ({
  //         ...prev,
  //         profilePic: event.target.result
  //       }));
  //     };

  //     reader.readAsDataURL(compressedFile);
  //   } catch (error) {
  //     console.error('Error processing image:', error);
  //     toast.error('Failed to process image');
  //   }
  // };


  // const compressImage = (file) => {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);

  //     reader.onload = (event) => {
  //       const img = new Image();
  //       img.src = event.target.result;

  //       img.onload = () => {
  //         const canvas = document.createElement('canvas');
  //         const ctx = canvas.getContext('2d');

  //         // Set canvas dimensions (max 800px)
  //         let width = img.width;
  //         let height = img.height;
  //         const MAX_DIMENSION = 800;

  //         if (width > height) {
  //           if (width > MAX_DIMENSION) {
  //             height *= MAX_DIMENSION / width;
  //             width = MAX_DIMENSION;
  //           }
  //         } else {
  //           if (height > MAX_DIMENSION) {
  //             width *= MAX_DIMENSION / height;
  //             height = MAX_DIMENSION;
  //           }
  //         }

  //         canvas.width = width;
  //         canvas.height = height;
  //         ctx.drawImage(img, 0, 0, width, height);

  //         // Convert to blob with quality 0.7
  //         canvas.toBlob(
  //           (blob) => resolve(blob),
  //           'image/jpeg',
  //           0.7
  //         );
  //       };
  //     };
  //   });
  // };

  // const triggerFileInput = () => {
  //   fileInputRef.current.click();
  // };


  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4' >
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>

          {error && (
            <div className='alert alert-error mb-4'>
              <span className=''>{error.response.data.message}</span>
            </div>
          )}

          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete your Profile</h1>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex flex-col items-center justify-center space-y-4'>
              {/* Image preview */}
              <div className='size-32 rounded-full bg-base-300 overflow-hidden relative'>
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    className='w-full h-full rounded-full object-cover border-2 border-primary'
                    alt="Profile"
                    onError={(e) => {
                      e.target.src = 'https://i.pravatar.cc/300?img=0'; // Fallback
                    }}
                  />
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <CameraIcon className='size-12 text-base-content opacity-40' />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              {/* <div className='flex items-center gap-2 group'>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  className='btn btn-primary'
                  type='button'
                  onClick={triggerFileInput}
                >
                  <UploadIcon className='size-5 mr-2 group-hover:animate-bounce text-white font-bold' />
                  <span className='text-white'>Upload Profile Picture</span>
                </button>
              </div> */}

              <div className="flex items-center gap-2 group">
                <button type="button" onClick={handleRandomAvatar} className="btn btn-primary text-white">
                  <ShuffleIcon className="size-4 mr-1 group-hover:animate-bounce  transition-all duration-500 ease-in-out" />
                  Change Avatar
                </button>
              </div>
            </div>
            {/* Generate Random Avatar BTN */}


            {/* Full Name */}
            <div className='form-control'>
              <div className="form-control w-full">
                <label className="label" id="name">
                  <span className="label-text mb-2">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full"
                  id="name"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div className='form-control'>
              <div className="form-control w-full">
                <label className="label" id="name">
                  <span className="label-text mb-2">Bio</span>
                </label>
                <textarea
                  name='bio'
                  placeholder="Tell Us about yourself and your language learning goals"
                  className="textarea textarea-bordered w-full"
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                />
              </div>
            </div>

            {/* Languages */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Native Language */}
              <div className='form-control'>
                <label className="label" id="nativelanguage">
                  <span className="label-text mb-2">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  className="select select-bordered w-full"
                  onChange={(e) => { setFormState({ ...formState, nativeLanguage: e.target.value }) }}
                  required
                >
                  <option value="">Select your native Language</option>
                  {LANGUAGES.map((lang) => (
                    <option value={lang.toLowerCase()} key={`native-${lang}`}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning Language */}
              <div className='form-control'>
                <label className="label" id="nativelanguage">
                  <span className="label-text mb-2">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  className="select select-bordered w-full"
                  onChange={(e) => { setFormState({ ...formState, learningLanguage: e.target.value }) }}
                  required
                >
                  <option value="">Select your Learning Language</option>
                  {LANGUAGES.map((lang) => (
                    <option value={lang.toLowerCase()} key={`learning-${lang}`}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text mb-2'>Location</span>
              </label>
              <div className='relative'>
                <MapPinIcon className='absolute left-3 z-[1000] top-3 size-5 text-base-content opacity-70' />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => { setFormState({ ...formState, location: e.target.value }) }}
                  className='input input-bordered w-full pl-10'
                  placeholder='City , Country'
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button className='btn btn-primary w-full text-white group' disabled={isPending} type='submit'>
              {!isPending ? (
                <>
                  <ShipWheelIcon className='size-5 mr-2 group-hover:animate-bounce  transition-all duration-500 ease-in-out' />
                  <span className='group-hover:animate-[pulse_2s_ease_infinite]'>Complete Onboarding</span>
                </>
              ) : (
                <>
                  <LoaderIcon className='animate-spin size-5 mr-2' />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div >
    </div >
  )
}

export default OnboardingPage