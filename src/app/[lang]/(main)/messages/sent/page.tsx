import { UserMessagesList } from '@/components/notifications/user/notifications-user-list';
import { ActionType } from '@/utils/enums';

export default function SentMessages() {
  return (
    <div className='mx-auto max-w-5xl'>
      <UserMessagesList actionType={ActionType.REQUEST} />
    </div>
  );
}
