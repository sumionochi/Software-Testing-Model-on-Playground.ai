"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader } from 'lucide-react';

const IsAuthorised = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
      } else {
        setIsAuthenticated(true); 
        setLoading(false); 
      }
    };

    checkSession();
  }, [router, supabase]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <>
      {children} 
    </>
  );
};

export default IsAuthorised;
