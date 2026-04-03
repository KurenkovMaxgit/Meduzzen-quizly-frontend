'use client';

import TokenSync from '@/components/auth/auth0-token-sync';
import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';

export default function Auth0ProviderWrapper({ children }: { children: React.ReactNode }) {
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      useRefreshTokens={true}
      cacheLocation='localstorage'
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!,
      }}
    >
      <TokenSync />

      {children}
    </Auth0Provider>
  );
}
