import { headers } from 'next/headers';
import GoogleLoginButton from './google-button';

export default async function GoogleLogin() {
  const currentLocale = (await headers()).get('x-current-lang');

  return <GoogleLoginButton currentLocale={currentLocale} />;
}
