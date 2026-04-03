import { mockUser } from '@/mock/user-mock';
import ProfileForm from '@/components/profile/profile-form';

export default async function UserProfile({ params }: { params: Promise<{ userId: string }> }) {
  const userId = (await params).userId;

  return <ProfileForm userId={userId} />;
}
