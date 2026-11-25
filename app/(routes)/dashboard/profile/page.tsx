import { UserProfile } from '@clerk/nextjs'

function Profile() {
  return (
    <div className='flex justify-center items-center min-h-screen py-10'>
       <UserProfile routing='hash' /> 
    </div>
  )
}

export default Profile