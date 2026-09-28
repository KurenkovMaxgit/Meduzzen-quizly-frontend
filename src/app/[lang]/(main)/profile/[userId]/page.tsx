import { ProfileForm } from '@/components/profile/profile-form';
import { User } from '@/entities/user.entity';

export default async function UserProfile({ params }: { params: Promise<{ userId: User['id'] }> }) {
  const userId = (await params).userId;

  return <ProfileForm userId={userId} />;
}
