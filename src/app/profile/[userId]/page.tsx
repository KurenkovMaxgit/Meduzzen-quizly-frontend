import { mockUser } from '@/mock/user-mock';
import ProfileForm from '@/components/profile/profile-form';

export default async function UserProfile({ params }: { params: Promise<{ userId: string }> }) {
  const userId = (await params).userId;
  const isOwner = userId === mockUser.id;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-primary text-surface-0 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
          {mockUser.firstName[0]}
          {mockUser.lastName[0]}
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {mockUser.firstName} {mockUser.lastName}
          </h1>
          <span className="text-surface-500 bg-surface-200 dark:bg-surface-800 mt-1 inline-block rounded-md px-2 py-1 text-sm">
            {mockUser.role}
          </span>
        </div>
      </div>

      <ProfileForm user={mockUser} isOwner={isOwner} />
    </div>
  );
}
