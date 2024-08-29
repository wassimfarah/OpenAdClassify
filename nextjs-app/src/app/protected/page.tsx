'use client'


import { useEffect } from 'react';
const ProtectedPage = () => {
  // Define protected routes

  useEffect(()=>{
    alert("protected!")
  }, [])

  return  (
    <div>
      <h1>Protected Page</h1>
      {/* protected page for testing */}
    </div>
  ) 
}

export default ProtectedPage;
