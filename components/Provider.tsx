'use client';

import React from 'react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

const Provider = (
    { children, session } : Readonly<{children: React.ReactNode; session?: Session | null}>
) => {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}

export default Provider