'use client';

import { useState } from 'react';
import { useMessages } from 'next-intl';
import { Dialog } from '@primereact/ui/dialog';
import { QueryUniversalList } from '@/components/common/universal-list/list-query';
import { ListHeader } from '@/components/common/universal-list/list-header';
import { useDebounce } from '@/hooks/use-debounce';
import { useUserFindAllQuery } from '@/lib/api-endpoints';
import { ReturnUser } from '@/types/user/return-user';
import { FindUser } from '@/types/user/find-user';
import { UserListItem } from './users-list-item';

export function AddUserDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dictionary = useMessages();

  const [searchUsersValue, setUsersSearchValue] = useState<string>('');
  const debouncedUsersSearch = useDebounce(searchUsersValue, 500);

  return (
    <Dialog.Root open={isOpen} position='center' modal draggable={false}>
      <Dialog.Backdrop className='cursor-pointer' onClick={onClose} />
      <Dialog.Portal>
        <Dialog.Positioner>
          <Dialog.Popup className='w-[95vw] max-w-full transform-gpu antialiased sm:w-md'>
            <Dialog.Header>
              <Dialog.Title>{dictionary.memberships.usersList.title}</Dialog.Title>
              <Dialog.HeaderActions>
                <Dialog.Close onClick={onClose}>
                  <i className='pi pi-times' />
                </Dialog.Close>
              </Dialog.HeaderActions>
            </Dialog.Header>

            <Dialog.Content>
              <QueryUniversalList<FindUser, ReturnUser>
                queryHook={useUserFindAllQuery}
                queryParams={{ search: debouncedUsersSearch }}
                itemTemplate={(user: ReturnUser) => <UserListItem user={{ ...user }} />}
                emptyMessage={dictionary.memberships.usersList.emptyMessage}
                paginator={true}
                rows={5}
              >
                <ListHeader
                  searchbar
                  searchValue={searchUsersValue}
                  setSearchValue={setUsersSearchValue}
                />
              </QueryUniversalList>
            </Dialog.Content>
          </Dialog.Popup>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
